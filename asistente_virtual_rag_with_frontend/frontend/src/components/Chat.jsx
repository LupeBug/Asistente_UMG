/* Importaciones */
import React, { useState } from "react";
import { sendMessageToBackend } from "../services/api"; // ✅ Importar la función API

/* Función para formatear respuestas con emojis */
function formatResponse(text) {
  if (text.includes("Duración") && text.includes("Precio")) {
    return text
      .split("\n")
      .map((line) => {
        if (line.includes("Listado")) return "";
        if (line.includes("Duración")) return "📅 " + line.trim();
        if (line.includes("Precio mensual")) return "💵 " + line.trim();
        if (line.includes("Precio anual")) return "💰 " + line.trim();
        return "🎓 " + line.trim();
      })
      .join("\n");
  }

  if (text.toLowerCase().includes("reglamento")) {
    return text
      .split("\n")
      .map((line) => {
        if (line.startsWith("Reglamento")) return "📘 " + line;
        if (line.match(/^\d+\./)) return "⚖️ " + line.trim();
        return line;
      })
      .join("\n");
  }

  return "💬 " + text;
}

/* Componente principal del chat */
export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]); // {role, text}
  const [loading, setLoading] = useState(false);

  /* ✅ Nueva función para enviar mensajes usando api.js */
  async function handleSendMessage(e) {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    setInput("");

    try {
      // Llamar al backend mediante el servicio api.js
      const reply = await sendMessageToBackend(input);

      // Formatear la respuesta recibida
      const formatted = formatResponse(reply);

      setMessages((prev) => [...prev, { role: "assistant", text: formatted }]);
    } catch (err) {
      console.error("❌ Error al enviar mensaje:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "⚠️ Error en la comunicación con el servidor." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4 bg-gradient-to-b from-blue-50 to-white rounded-lg shadow-md">
      <h1 className="text-center text-2xl font-bold text-blue-700 mb-4">
        🎓 Asistente Virtual - Universidad Mariano Gálvez
      </h1>

      {/* Área de mensajes */}
      <div className="border rounded-lg p-4 h-96 overflow-auto mb-4 bg-gray-100 shadow-inner">
        {messages.length === 0 && (
          <div className="text-gray-500 text-center">
            💬 Aquí aparecerán las respuestas del asistente.
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`mb-3 ${m.role === "user" ? "text-right" : "text-left"}`}>
            <div
              className={`inline-block p-3 rounded-2xl shadow ${
                m.role === "user"
                  ? "bg-blue-600 text-white ml-auto"
                  : "bg-white text-gray-900 mr-auto border border-gray-200"
              }`}
              dangerouslySetInnerHTML={{ __html: m.text.replace(/\n/g, "<br>") }}
            />
          </div>
        ))}
      </div>

      {/* Formulario de entrada */}
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          className="flex-1 border rounded-lg p-2 shadow-inner focus:ring-2 focus:ring-blue-400 outline-none"
          placeholder="Escribe tu pregunta sobre las carreras o reglamentos..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow"
          disabled={loading}
        >
          {loading ? "Enviando..." : "Enviar"}
        </button>
      </form>
    </div>
  );
}