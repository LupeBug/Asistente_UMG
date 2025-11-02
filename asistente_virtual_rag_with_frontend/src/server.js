import express from "express";
import dotenv from "dotenv";
import chatRoutes from "./routes/chat.js";
import uploadRoutes from "./routes/upload.js"; //importamos la ruta de subida
import cors from "cors";

dotenv.config();
const app = express();
// Configuración de CORS para permitir solicitudes desde el frontend
app.use(cors({
  origin: 'http://localhost:5173', // Puerto del frontend Vite
  credentials: true
}));

// Middleware de logging para requests (después de express.json)
app.use(express.json());

app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`\n🚀 [${timestamp}] ${req.method} ${req.path}`);
  console.log(`📥 Headers:`, JSON.stringify(req.headers, null, 2));
  console.log(`📦 Body:`, JSON.stringify(req.body, null, 2));
  console.log(`🔗 Query:`, JSON.stringify(req.query, null, 2));
  console.log(`📍 IP: ${req.ip || req.connection.remoteAddress}`);
  console.log(`🔍 Content-Type: ${req.get('Content-Type')}`);
  console.log(`🔍 Content-Length: ${req.get('Content-Length')}`);
  console.log(`🔍 Raw body exists: ${!!req.body}`);
  console.log(`🔍 Body type: ${typeof req.body}`);
  console.log('─'.repeat(50));
  next();
});

// Middleware de logging para responses
app.use((req, res, next) => {
  const originalSend = res.send;
  res.send = function (data) {
    const timestamp = new Date().toISOString();
    console.log(`\n📤 [${timestamp}] Response Status: ${res.statusCode}`);
    try {
      console.log(`📤 Response Body TryInicial:`, req.body);
      const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
      console.log(`📤 Response Body Try:`, data);
      console.log(`📤 Response Body:`, JSON.stringify(parsedData, null, 2));
    } catch (e) {
      console.log(`📤 Response Body:`, data);
    }
    console.log('═'.repeat(50));
    return originalSend.call(this, data);
  };
  next();
});

// Ruta para subir documentos desde n8n
app.use("/api/upload", uploadRoutes);

app.use("/api/chat", chatRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
import path from "path";
import { fileURLToPath } from "url";

// Obtener la ruta actual del archivo
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir los archivos estáticos del frontend (carpeta dist)
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Cualquier ruta no manejada por la API redirige al index.html del frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
});