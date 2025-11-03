const API_URL = "https://asistente-umg-server.onrender.com";

export async function sendMessageToBackend(message) {
  try {
    const response = await fetch(`${API_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error("Error en la comunicación con el servidor.");
    }

    const data = await response.json();
    return data.reply;
  } catch (error) {
    console.error("❌ Error comunicándose con el backend:", error);
    return "⚠️ Error en la comunicación con el servidor.";
  }
}
