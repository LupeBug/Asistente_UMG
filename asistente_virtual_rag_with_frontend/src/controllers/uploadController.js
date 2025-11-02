/* Importaciones de módulos para manejo de archivos y rutas */
import fs from "fs";
import path from "path";

/* Función principal para manejar la subida de archivos */
export const handleUpload = async (req, res) => {
  try {
    console.log("\n📤 [UPLOAD] Petición recibida en /api/upload");
    console.log("📄 Body recibido:", req.body);

    /* Extracción y validación de campos del cuerpo de la solicitud */
    const { filename, content } = req.body;
    
    if (!filename || !content) {
      console.error("❌ [UPLOAD] Faltan campos en el body");
      return res.status(400).json({ success: false, error: "Faltan campos filename o content" });
    }

    /* Creación de la carpeta 'uploads' si no existe */
    const uploadDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    /* Guardado del archivo en el sistema de archivos */
    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, content, "utf8");

    console.log(`✅ [UPLOAD] Archivo guardado correctamente: ${filePath}`);
    return res.status(200).json({ success: true, message: "Archivo recibido y guardado correctamente", file: filePath });
  } catch (error) {
    /* Manejo de errores con logging */
    console.error("❌ [UPLOAD] Error al procesar el archivo:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
