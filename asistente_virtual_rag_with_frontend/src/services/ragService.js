/* Importaciones de bibliotecas para IA y base de datos */
import Groq from "groq-sdk";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

/* Inicialización de clientes para Groq, OpenAI y Supabase */
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

/* Función principal para procesar consultas con RAG */
export const queryRag = async (question) => {
  const startTime = Date.now();
  console.log(`\n🔍 [RAG] Iniciando queryRag`);
  console.log(`❓ [RAG] Pregunta: "${question}"`);
  
  try {
    /* Verificación de configuración de Supabase */
    const hasSupabaseConfig = process.env.SUPABASE_URL && process.env.SUPABASE_KEY && 
                             process.env.SUPABASE_URL !== 'tu_supabase_url_aqui' && 
                             process.env.SUPABASE_KEY !== 'tu_supabase_anon_key_aqui';

    console.log(`🔧 [RAG] Configuración Supabase: ${hasSupabaseConfig ? '✅ Configurada' : '❌ No configurada'}`);

    if (hasSupabaseConfig) {
      /* Generación de embedding con OpenAI */
      console.log(`🌐 [RAG] Generando embedding con OpenAI...`);
      // Usar OpenAI para embeddings
      const embeddingResponse = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: question
      });
      
      const questionEmbedding = embeddingResponse.data[0].embedding;
      console.log(`✅ [RAG] Embedding generado (${questionEmbedding.length} dimensiones)`);

      /* Búsqueda de documentos similares en Supabase */
      console.log(`🔍 [RAG] Buscando documentos similares...`);
      const { data: documents, error } = await supabase.rpc('match_documents', {
        query_embedding: questionEmbedding,
        match_threshold: 0.1,  // ← CAMBIADO DE 0.7 A 0.1
        match_count: 5         // ← AUMENTADO DE 2 A 5
      });

      if (error) {
        console.error(`❌ [RAG] Error buscando documentos:`, error);
        console.log(`⚠️ [RAG] Sin documentos, respondiendo directamente`);
        const completion = await groq.chat.completions.create({
          model: "llama-3.1-8b-instant",
          messages: [
            { role: "system", content: "Eres un asistente virtual útil." },
            { role: "user", content: question }
          ]
        });
        const response = completion.choices[0].message.content;
        console.log(`✅ [RAG] Respuesta generada (${Date.now() - startTime}ms): "${response}"`);
        return response;
      }

      /* Construcción de contexto con documentos encontrados */
      const context = documents?.map(doc => doc.content).join("\n") || "";
      console.log(`📚 [RAG] Documentos encontrados: ${documents?.length || 0}`);
      console.log(`📄 [RAG] Contexto construido (${context.length} caracteres)`);
      
      if (documents && documents.length > 0) {
        /* Generación de respuesta con contexto usando Groq */
        console.log(`🤖 [RAG] Generando respuesta con contexto usando Groq...`);
        const completion = await groq.chat.completions.create({
          model: "llama-3.1-8b-instant",
          messages: [
            { 
              role: "system", 
              content: "Eres un asistente experto. Responde basándote en el contexto proporcionado. Si no tienes información suficiente, dilo claramente." 
            },
            { 
              role: "user", 
              content: `Contexto: ${context}\n\nPregunta: ${question}` 
            }
          ]
        });

        const response = completion.choices[0].message.content;
        console.log(`✅ [RAG] Respuesta generada con contexto (${Date.now() - startTime}ms): "${response}"`);
        return response;
      } else {
        console.log(`⚠️ [RAG] No se encontraron documentos similares, respondiendo directamente`);
        const completion = await groq.chat.completions.create({
          model: "llama-3.1-8b-instant",
          messages: [
            { role: "system", content: "Eres un asistente virtual útil." },
            { role: "user", content: question }
          ]
        });
        const response = completion.choices[0].message.content;
        console.log(`✅ [RAG] Respuesta generada (${Date.now() - startTime}ms): "${response}"`);
        return response;
      }
    } else {
      /* Modo simple sin RAG, respuesta directa con Groq */
      console.log(`🔄 [RAG] Modo simple: respondiendo sin RAG`);
      const completion = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
          { 
            role: "system", 
            content: "Eres un asistente virtual útil y amigable. Responde de manera clara y concisa en español." 
          },
          { role: "user", content: question }
        ]
      });

      const response = completion.choices[0].message.content;
      console.log(`✅ [RAG] Respuesta generada modo simple (${Date.now() - startTime}ms): "${response}"`);
      return response;
    }
  } catch (error) {
    /* Manejo de errores con logging */
    const processingTime = Date.now() - startTime;
    console.error(`❌ [RAG] Error después de ${processingTime}ms:`, error.message);
    console.error(`📊 [RAG] Stack trace:`, error.stack);
    return "Lo siento, hubo un error procesando tu consulta. Por favor, inténtalo de nuevo.";
  }
};

/* Función para insertar documentos en Supabase */
export async function insertDocument(content, filename = "documento_subido") {
  try {
    console.log(`📄 [RAG] Insertando documento: ${filename}`);

    /* Generación de embedding para el documento */
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: content,
    });

    const [{ embedding }] = embeddingResponse.data;

    /* Inserción del documento en la base de datos */
    const { data, error } = await supabase.from("documents").insert([
      {
        content,
        metadata: { filename },
        embedding,
      },
    ]);

    if (error) throw error;

    console.log(`✅ Documento "${filename}" insertado correctamente.`);
    return data;
  } catch (error) {
    console.error("❌ Error insertando documento:", error);
    throw error;
  }
}
