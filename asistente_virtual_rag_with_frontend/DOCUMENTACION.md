# Documentación Técnica - Asistente Virtual Mariano

## 📘 Introducción
El **Asistente Virtual Mariano** es un chatbot educativo desarrollado como proyecto final de universidad. Su arquitectura combina un frontend interactivo, un backend robusto y técnicas de **RAG (Retrieval-Augmented Generation)** para ofrecer respuestas contextuales basadas en archivos locales. Se integra con **n8n** para automatización, permitiendo actualizaciones dinámicas del conocimiento. El sistema está diseñado para ser escalable, educativo y fácil de desplegar.

## 💡 Tecnologías Implementadas
- **React**: Biblioteca para construir interfaces de usuario dinámicas. Elegida por su eficiencia en componentes reutilizables y su ecosistema maduro. Cumple el rol de renderizar el chat y manejar interacciones del usuario.
- **Vite**: Herramienta de construcción rápida para proyectos frontend. Seleccionada por su velocidad en desarrollo y hot-reload. Acelera el proceso de desarrollo del frontend.
- **TailwindCSS**: Framework de CSS utilitario para estilos rápidos. Optado por su simplicidad y personalización. Estiliza la interfaz del chat de manera moderna y responsiva.
- **Node.js**: Entorno de ejecución para JavaScript en el servidor. Elegido por su asincronía y compatibilidad con Express. Forma la base del backend.
- **Express**: Framework web minimalista para Node.js. Seleccionado por su ligereza y facilidad de rutas. Maneja las APIs y la lógica del servidor.
- **n8n**: Plataforma de automatización de flujos. Usada para integrar procesos sin código. Automatiza la carga de documentos al RAG.
- **Render**: Servicio de despliegue en la nube gratuito. Elegido por su simplicidad y soporte para Node.js. Hospeda la aplicación web.

## ⚙️ Flujo General del Proyecto
El flujo de comunicación sigue este patrón:
- Usuario → Frontend (React) → Backend (Express) → RAG (procesamiento con archivos locales) → Respuesta → Usuario

Diagrama simple:
```
Usuario interactúa con chat (Frontend)
    ↓
Envía consulta a API (Backend)
    ↓
RAG recupera contexto de /documents (ej. uni.txt)
    ↓
IA genera respuesta (OpenAI)
    ↓
Respuesta se muestra en el chat
```

## 🔄 Flujo de Automatización n8n
Los flujos en **n8n** se activan mediante webhooks o programaciones automáticas. Por ejemplo, un flujo puede detectar nuevos archivos en `/uploads`, procesarlos y actualizar el RAG. Interactúa con el backend vía APIs para cargar documentos, asegurando que el asistente tenga acceso a información actualizada sin reinicios manuales.

## 🧩 RAG (Retrieval-Augmented Generation)
El **RAG** combina recuperación de información con generación de texto. Utiliza archivos locales como `uni.txt` en `/documents` para buscar contexto relevante a la consulta del usuario. Se integra al flujo de conversación: la consulta se vectoriza, se recupera el contenido similar, y se pasa a un modelo de IA (como OpenAI) para generar una respuesta precisa y educativa.

## 🌍 Despliegue en Render
1. Conecta el repositorio de GitHub a Render.
2. Configura comandos: Build (`npm install && npm run build`), Start (`npm start`).
3. Agrega variables de entorno en el panel de Render.
4. Despliega automáticamente con cada push. La URL pública se genera tras el primer despliegue.

## 📦 Dependencias Principales
- `express`: Framework para el servidor backend, maneja rutas y middleware.
- `cors`: Habilita solicitudes cross-origin entre frontend y backend.
- `dotenv`: Carga variables de entorno desde `.env`.
- `vite`: Herramienta de desarrollo para el frontend React.
- `react`: Biblioteca para componentes de interfaz.
- `tailwindcss`: Utilidades CSS para estilos rápidos.

## 👩‍💻 Autoría
Proyecto desarrollado por Guadalupe Diana Rubí Barahona Casia para el curso Desarrollo Web en UMG. Contacto: gbrahonac1@miumg.edu.gt
