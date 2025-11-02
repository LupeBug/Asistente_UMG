import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function debugRAG() {
  console.log(`\n🔍 [DEBUG] Diagnóstico completo del RAG`);
  
  try {
    // 1. Verificar documentos
    console.log(`\n1️⃣ [DEBUG] Verificando documentos...`);
    const { data: docs, error: docsError } = await supabase
      .from('documents')
      .select('id, content, metadata, embedding')
      .limit(10);
    
    if (docsError) {
      console.error(`❌ [DEBUG] Error obteniendo documentos:`, docsError);
      return;
    }
    
    console.log(`📊 [DEBUG] Documentos encontrados: ${docs?.length || 0}`);
    
    if (docs && docs.length > 0) {
      docs.forEach((doc, i) => {
        console.log(`📄 [DEBUG] Doc ${i + 1}:`, {
          id: doc.id,
          filename: doc.metadata?.filename,
          hasEmbedding: !!doc.embedding,
          embeddingSize: doc.embedding?.length || 0,
          contentPreview: doc.content.substring(0, 50) + '...'
        });
      });
    } else {
      console.log(`❌ [DEBUG] No hay documentos en la base de datos`);
      return;
    }

    // 2. Probar función match_documents
    console.log(`\n2️⃣ [DEBUG] Probando función match_documents...`);
    const testEmbedding = new Array(1536).fill(0.1);
    const { data: matches, error: matchError } = await supabase
      .rpc('match_documents', {
        query_embedding: testEmbedding,
        match_threshold: 0.1, // Umbral muy bajo
        match_count: 10
      });
    
    if (matchError) {
      console.error(`❌ [DEBUG] Error en match_documents:`, matchError);
      console.log(`💡 [DEBUG] Necesitas crear la función match_documents en Supabase`);
    } else {
      console.log(`✅ [DEBUG] Función match_documents funciona`);
      console.log(`📊 [DEBUG] Matches encontrados: ${matches?.length || 0}`);
      if (matches && matches.length > 0) {
        matches.forEach((match, i) => {
          console.log(`🎯 [DEBUG] Match ${i + 1}:`, {
            similarity: match.similarity,
            filename: match.metadata?.filename,
            content: match.content.substring(0, 50) + '...'
          });
        });
      } else {
        console.log(`⚠️ [DEBUG] No se encontraron coincidencias con el embedding de prueba`);
      }
    }

    // 3. Probar con un embedding real
    console.log(`\n3️⃣ [DEBUG] Probando con embedding real...`);
    const testQuestion = "¿Qué productos tienes?";
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: testQuestion
    });
    const realEmbedding = embeddingResponse.data[0].embedding;
    
    const { data: realMatches, error: realMatchError } = await supabase
      .rpc('match_documents', {
        query_embedding: realEmbedding,
        match_threshold: 0.1,
        match_count: 5
      });
    
    if (realMatchError) {
      console.error(`❌ [DEBUG] Error con embedding real:`, realMatchError);
    } else {
      console.log(`📊 [DEBUG] Matches con embedding real: ${realMatches?.length || 0}`);
      if (realMatches && realMatches.length > 0) {
        realMatches.forEach((match, i) => {
          console.log(`🎯 [DEBUG] Real Match ${i + 1}:`, {
            similarity: match.similarity,
            filename: match.metadata?.filename,
            content: match.content.substring(0, 100) + '...'
          });
        });
      } else {
        console.log(`⚠️ [DEBUG] No se encontraron coincidencias con el embedding real`);
      }
    }

    // 4. Resumen
    console.log(`\n📊 [DEBUG] === RESUMEN ===`);
    console.log(`📄 Documentos: ${docs?.length || 0}`);
    console.log(`🔗 Función match_documents: ${matchError ? '❌ Error' : '✅ OK'}`);
    console.log(`🎯 Matches de prueba: ${matches?.length || 0}`);
    console.log(`🎯 Matches reales: ${realMatches?.length || 0}`);
    
    if (docs && docs.length > 0 && !matchError && (matches?.length > 0 || realMatches?.length > 0)) {
      console.log(`🎉 [DEBUG] ¡El RAG está funcionando correctamente!`);
    } else {
      console.log(`⚠️ [DEBUG] El RAG necesita configuración adicional`);
    }

  } catch (error) {
    console.error(`❌ [DEBUG] Error general:`, error);
  }
}

debugRAG();