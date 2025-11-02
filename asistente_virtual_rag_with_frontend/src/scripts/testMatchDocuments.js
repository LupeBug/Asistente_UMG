import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function testMatchDocuments() {
  console.log(`\n🔍 [TEST] Probando función match_documents`);
  
  try {
    // 1. Verificar documentos
    console.log(`\n1️⃣ [TEST] Verificando documentos...`);
    const { data: docs, error: docsError } = await supabase
      .from('documents')
      .select('id, content, metadata, embedding')
      .limit(5);
    
    if (docsError) {
      console.error(`❌ [TEST] Error obteniendo documentos:`, docsError);
      return;
    }
    
    console.log(`📊 [TEST] Documentos encontrados: ${docs?.length || 0}`);
    
    if (docs && docs.length > 0) {
      docs.forEach((doc, i) => {
        console.log(`📄 [TEST] Doc ${i + 1}:`, {
          id: doc.id,
          filename: doc.metadata?.filename,
          hasEmbedding: !!doc.embedding,
          embeddingSize: doc.embedding?.length || 0,
          contentPreview: doc.content.substring(0, 50) + '...'
        });
      });
    } else {
      console.log(`❌ [TEST] No hay documentos en la base de datos`);
      return;
    }

    // 2. Probar función match_documents con embedding real
    console.log(`\n2️⃣ [TEST] Probando con embedding real...`);
    const testQuestion = "¿Qué productos tienes?";
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: testQuestion
    });
    const realEmbedding = embeddingResponse.data[0].embedding;
    
    const { data: realMatches, error: realMatchError } = await supabase
      .rpc('match_documents', {
        query_embedding: realEmbedding,
        match_threshold: 0.1, // Umbral muy bajo
        match_count: 5
      });
    
    if (realMatchError) {
      console.error(`❌ [TEST] Error con embedding real:`, realMatchError);
    } else {
      console.log(`📊 [TEST] Matches con embedding real: ${realMatches?.length || 0}`);
      if (realMatches && realMatches.length > 0) {
        realMatches.forEach((match, i) => {
          console.log(`🎯 [TEST] Real Match ${i + 1}:`, {
            similarity: match.similarity,
            filename: match.metadata?.filename,
            content: match.content.substring(0, 100) + '...'
          });
        });
      } else {
        console.log(`⚠️ [TEST] No se encontraron coincidencias con el embedding real`);
      }
    }

  } catch (error) {
    console.error(`❌ [TEST] Error general:`, error);
  }
}

testMatchDocuments();