import React from 'react'
import Chat from './components/Chat'

export default function App() {
  return (
    /* Contenedor principal con fondo gradiente y padding responsivo */
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 md:p-6 font-sans">
      {/* Encabezado con logo, título y estilos universitarios */}
      <header className="max-w-4xl mx-auto mb-8 flex items-center justify-center md:justify-start bg-white rounded-lg shadow-md p-4 border-l-4 border-[#FFD700]">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRR4YvFZALqhd-Kl91Fgssmje1h1gJU8rJIgg&s"
          alt="Logo Universidad Mariano Gálvez"
          className="h-14 w-14 mr-4 rounded-full"
        />
        <h1 className="text-xl md:text-3xl font-bold text-[#003366] tracking-wide">
         🤖 Hola, soy <span className="text-[#00297A]">Neo</span> — estoy aquí para ayudarte con tus consultas.
        </h1>
      </header>

      {/* Contenedor del chat con estilos modernos y efectos hover */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-8 hover:shadow-2xl transition-shadow duration-300">
        <Chat />
      </div>

      {/* Pie de página con copyright y colores temáticos */}
      <footer className="max-w-4xl mx-auto mt-8 text-center text-sm text-[#003366] bg-[#B22222] bg-opacity-10 rounded-lg p-4 border-t border-[#FFD700]">
        © 2025 Universidad Mariano Gálvez de Guatemala — Asistente Académico
      </footer>
    </div>
  )
}
