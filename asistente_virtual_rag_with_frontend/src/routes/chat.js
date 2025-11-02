/* Importación de Router de Express y el controlador de chat */
import { Router } from "express";
import { handleChat } from "../controllers/chatController.js";

/* Creación de la instancia del router */
const router = Router();

/* Definición de la ruta POST para el chat */
router.post("/", handleChat);

/* Exportación del router para uso en el servidor principal */
export default router;