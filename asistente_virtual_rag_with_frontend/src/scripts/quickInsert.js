import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Función para dividir texto en chunks
function splitIntoChunks(text, maxLength = 1000) {
  const chunks = [];
  const sentences = text.split(/[.!?]+/);
  let currentChunk = '';

  for (const sentence of sentences) {
    if (currentChunk.length + sentence.length > maxLength && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += (currentChunk ? '. ' : '') + sentence;
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

async function uploadDocumentsFromFolder(documentsFolder = './documents') {
  console.log(`\n📁 [UPLOAD] Subiendo documentos desde: ${documentsFolder}`);
  
  try {
    // Verificar si la carpeta existe
    if (!fs.existsSync(documentsFolder)) {
      console.log(`❌ [UPLOAD] La carpeta ${documentsFolder} no existe`);
      console.log(`💡 [UPLOAD] Creando carpeta...`);
      fs.mkdirSync(documentsFolder, { recursive: true });
      console.log(`✅ [UPLOAD] Carpeta creada: ${documentsFolder}`);
      console.log(`💡 [UPLOAD] Agrega archivos .txt a la carpeta y ejecuta de nuevo`);
      return;
    }

    // Leer archivos .txt de la carpeta
    const files = fs.readdirSync(documentsFolder);
    const txtFiles = files.filter(file => file.endsWith('.txt'));
    
    console.log(`📄 [UPLOAD] Archivos .txt encontrados: ${txtFiles.length}`);
    
    if (txtFiles.length === 0) {
      console.log(`⚠️ [UPLOAD] No se encontraron archivos .txt en la carpeta`);
      console.log(`💡 [UPLOAD] Agrega archivos .txt a la carpeta ${documentsFolder}`);
      return;
    }

    let processedCount = 0;
    let errorCount = 0;
    let totalChunks = 0;

    for (const file of txtFiles) {
      try {
        console.log(`\n🔄 [UPLOAD] Procesando: ${file}`);
        
        const filePath = path.join(documentsFolder, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        
        if (!content.trim()) {
          console.log(`⚠️ [UPLOAD] Archivo vacío: ${file}`);
          continue;
        }

        console.log(`📝 [UPLOAD] Contenido leído: ${content.length} caracteres`);

        // Dividir contenido en chunks
        const chunks = splitIntoChunks(content, 1000);
        console.log(`📄 [UPLOAD] Dividido en ${chunks.length} chunks`);
        
        for (let i = 0; i < chunks.length; i++) {
          const chunk = chunks[i];
          
          try {
            // Generar embedding
            console.log(`🌐 [UPLOAD] Generando embedding para chunk ${i + 1}/${chunks.length}...`);
            const embeddingResponse = await openai.embeddings.create({
              model: "text-embedding-3-small",
              input: chunk
            });

            const embedding = embeddingResponse.data[0].embedding;

            // Guardar en Supabase
            console.log(`💾 [UPLOAD] Guardando chunk ${i + 1}/${chunks.length}...`);
            const { data, error } = await supabase
              .from('documents')
              .insert({
                content: chunk,
                metadata: {
                  filename: file,
                  chunk_index: i,
                  total_chunks: chunks.length,
                  file_type: '.txt',
                  file_size: content.length,
                  created_at: new Date().toISOString(),
                  source: 'folder-upload'
                },
                embedding: embedding
              })
              .select();

            if (error) {
              console.error(`❌ [UPLOAD] Error guardando chunk ${i + 1} de ${file}:`, error.message);
              errorCount++;
            } else {
              console.log(`✅ [UPLOAD] Chunk ${i + 1}/${chunks.length} guardado (ID: ${data[0].id})`);
              totalChunks++;
            }

            // Pausa pequeña para no sobrecargar la API
            await new Promise(resolve => setTimeout(resolve, 200));

          } catch (chunkError) {
            console.error(`❌ [UPLOAD] Error en chunk ${i + 1} de ${file}:`, chunkError.message);
            errorCount++;
          }
        }

        processedCount++;
        console.log(`✅ [UPLOAD] Archivo ${file} procesado completamente`);

      } catch (error) {
        console.error(`❌ [UPLOAD] Error procesando ${file}:`, error.message);
        errorCount++;
      }
    }

    // Resumen final
    console.log(`\n📊 [UPLOAD] === RESUMEN FINAL ===`);
    console.log(`✅ Archivos procesados: ${processedCount}`);
    console.log(`📄 Chunks totales: ${totalChunks}`);
    console.log(`❌ Errores: ${errorCount}`);
    console.log(`🎉 [UPLOAD] Proceso completado!`);

  } catch (error) {
    console.error(`❌ [UPLOAD] Error general:`, error);
  }
}

// Función para limpiar documentos existentes
async function clearDocuments() {
  console.log(`\n🗑️ [CLEAR] Limpiando documentos existentes...`);
  
  try {
    const { error } = await supabase
      .from('documents')
      .delete()
      .neq('id', 0);

    if (error) {
      console.error(`❌ [CLEAR] Error:`, error);
      return;
    }

    console.log(`✅ [CLEAR] Documentos eliminados exitosamente`);
  } catch (error) {
    console.error(`❌ [CLEAR] Error general:`, error);
  }
}

// Manejo de argumentos de línea de comandos
const args = process.argv.slice(2);
const command = args[0];
const folder = args[1] || './documents';
const clearFirst = args.includes('--clear') || args.includes('-c');

// Ejecutar según el comando
if (command === 'clear') {
  clearDocuments();
} else if (command === 'upload' || !command) {
  if (clearFirst) {
    console.log(`🗑️ [UPLOAD] Limpiando documentos existentes primero...`);
    await clearDocuments();
  }
  uploadDocumentsFromFolder(folder);
} else {
  console.log(`\n📖 [HELP] Uso del script:`);
  console.log(`node src/scripts/quickInsert.js [comando] [carpeta] [opciones]`);
  console.log(`\nComandos:`);
  console.log(`  upload (o sin comando) - Subir documentos desde carpeta`);
  console.log(`  clear                 - Limpiar documentos`);
  console.log(`\nOpciones:`);
  console.log(`  --clear, -c           - Limpiar antes de subir`);
  console.log(`\nEjemplos:`);
  console.log(`  node src/scripts/quickInsert.js`);
  console.log(`  node src/scripts/quickInsert.js upload ./mi-carpeta`);
  console.log(`  node src/scripts/quickInsert.js upload ./mi-carpeta --clear`);
  console.log(`  node src/scripts/quickInsert.js clear`);
}