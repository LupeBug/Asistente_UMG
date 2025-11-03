// frontend/src/services/api.js

// 🔗 URL base del backend
//const API_URL = "http://localhost:3000"; 
const API_URL = "https://asistente-umg-server.onrender.com"; 
// (para pruebas locales puedes cambiar a: "http://localhost:3000")

export async function sendMessageToBackend(message) {
  try {
    const response = await fetch(`${API_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: no se pudo contactar con el servidor.`);
    }

    const data = await response.json();

    // Verificamos que tenga el formato esperado
    if (!data.reply) {
      console.error("⚠️ Respuesta inesperada del servidor:", data);
      return "⚠️ Error en la comunicación con el servidor.";
    }

    return data.reply;
  } catch (error) {
    console.error("❌ Error comunicándose con el backend:", error);
    return "⚠️ Error en la comunicación con el servidor.";
  }
}