/* Importación del servicio RAG para consultas */
import { queryRag } from "../services/ragService.js";

/* Función principal para manejar solicitudes de chat */
export const handleChat = async (req, res) => {
  const startTime = Date.now();
  console.log(`\n💬 [CHAT] Iniciando procesamiento de mensaje`);
  console.log(`📝 Mensaje recibido: "${req.body.message}"`);
  
  // AGREGAR ESTOS LOGS DE DEBUG:
  console.log(`🔍 [CHAT] Request body completo:`, req.body);
  console.log(`🔍 [CHAT] Request body type:`, typeof req.body);
  console.log(`🔍 [CHAT] Request body keys:`, Object.keys(req.body || {}));
  console.log(`🔍 [CHAT] Request body message:`, req.body?.message);
  console.log(`🔍 [CHAT] Request body message type:`, typeof req.body?.message);
  console.log(`🔍 [CHAT] Request body message length:`, req.body?.message?.length);
  
  try {
    /* Extracción y validación del mensaje del cuerpo de la solicitud */
    const { message } = req.body;
    
    if (!message) {
      console.log(`❌ [CHAT] Error: Mensaje vacío`);
      return res.status(400).json({ error: "Mensaje requerido" });
    }
    
    /* Llamada al servicio RAG para procesar la consulta */
    console.log(`🔄 [CHAT] Llamando a queryRag...`);
    const response = await queryRag(message);
    
    /* Envío de la respuesta exitosa con tiempo de procesamiento */
    const processingTime = Date.now() - startTime;
    console.log(`✅ [CHAT] Respuesta generada en ${processingTime}ms`);
    console.log(`🤖 [CHAT] Respuesta: "${response}"`);
    
    res.json({ response });
  } catch (err) {
    /* Manejo de errores con logging detallado */
    const processingTime = Date.now() - startTime;
    console.error(`❌ [CHAT] Error después de ${processingTime}ms:`, err.message);
    console.error(`📊 [CHAT] Stack trace:`, err.stack);
    res.status(500).json({ error: "Error procesando el chat" });
  }
};