// ==========================
// 📦 Importaciones principales
// ==========================
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// ==========================
// 🧩 Importaciones de rutas
// ==========================
import chatRoutes from "./routes/chat.js";
import uploadRoutes from "./routes/upload.js";

// ==========================
// ⚙️ Configuración inicial
// ==========================
dotenv.config();
const app = express();

// ==========================
// 🌍 Configuración de CORS
// ==========================
// ✅ Permite conexiones tanto locales como desde Render
app.use(
  cors({
    origin: [
      "http://localhost:5173",               // entorno local de Vite
      "https://asistente-umg.onrender.com",  // dominio del frontend en Render
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);

// ==========================
// 🧠 Middleware para parsear JSON
// ==========================
app.use(express.json());

// ==========================
// 🧾 Logging de peticiones
// ==========================
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`\n🚀 [${timestamp}] ${req.method} ${req.path}`);
  console.log(`📥 Headers:`, JSON.stringify(req.headers, null, 2));
  console.log(`📦 Body:`, JSON.stringify(req.body, null, 2));
  console.log(`🔗 Query:`, JSON.stringify(req.query, null, 2));
  console.log(`📍 IP: ${req.ip || req.connection.remoteAddress}`);
  console.log("─".repeat(60));
  next();
});

// ==========================
// 📡 Rutas principales
// ==========================
app.use("/api/chat", chatRoutes);
app.use("/api/upload", uploadRoutes);

// ==========================
// 🧱 Servir el frontend (solo en producción)
// ==========================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === "production") {
  // servir los archivos del frontend compilado
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  // redirigir cualquier ruta desconocida al index.html del frontend
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
  });
} else {
  // mensaje visible solo en modo desarrollo
  app.get("/", (req, res) => {
    res.send("✅ Servidor backend en modo desarrollo");
  });
}

// ==========================
// 🚀 Inicialización del servidor
// ==========================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Servidor corriendo en puerto ${PORT} 🚀`)
);
