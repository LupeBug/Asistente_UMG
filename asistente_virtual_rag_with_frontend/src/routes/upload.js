import express from "express";
import { handleUpload } from "../controllers/uploadController.js";

const router = express.Router();

// Ruta para subir documentos desde n8n
router.post("/", handleUpload);

export default router;
