su Asistente Virtual Mariano
Descripción
El Asistente Virtual Mariano es un proyecto final de universidad que integra un chatbot educativo e informativo impulsado por inteligencia artificial. Utiliza RAG (Retrieval-Augmented Generation) con archivos locales para proporcionar respuestas precisas y contextuales, conectándose a flujos de automatización en n8n . Desarrollado con Node.js, Express, React y TailwindCSS , y desplegado en Render para un acceso web gratuito y eficiente.

🚀 Instalación
Siga estos pasos para configurar y ejecutar el proyecto localmente:

Clona el:

git clone https://github.com/tu-usuario/asistente-virtual-mariano.git
cd asistente-virtual-mariano
Instala las dependencias:

npm install
Crea y configura el archivo .enven la raíz del proyecto con las siguientes variables:

OPENAI_API_KEY=tu_api_key_de_openai
NODE_ENV=production
OPENAI_API_KEY: Clave de API para acceder a los modelos de OpenAI.
NODE_ENV: Defina el entorno de ejecución (desarrollo o producción).
Ejecuta el proyecto localmente:

npm start
El servidor se iniciará en http://localhost:3000(o el puerto configurado).

🧠 Tecnologías Utilizadas
Frontend : React + Vite + TailwindCSS para una interfaz de usuario rápida y moderna.
Backend : Node.js + Express para manejar las rutas y lógica del servidor.
Integraciones : n8n para automatización de flujos, RAG con archivos locales como uni.txtpara recuperación de conocimiento.
Despliegue : Renderizado como plataforma de hosting gratuito.
📂 Estructura del Proyecto
/frontend/— Interfaz de usuario y componentes del chat.
/src/controllers/— Lógica de controladores para el chat y carga de archivos.
/src/routes/— Rutas de la API para comunicación entre frontend y backend.
/src/services/— Integración con RAG y modelos de IA para procesamiento de consultas.
/documents/— Archivos base del conocimiento, como uni.txt, utilizados por el RAG.
/uploads/— Documentos cargados dinámicamente desde n8n.
🌐 Despliegue
El proyecto se despliega en Render , un servicio gratuito de hosting. Configure los siguientes comandos en el panel de Render:

Comando de compilación :npm install && npm run build
Comando de inicio :npm start
URL pública: [Inserta aquí la URL de Render una vez desplegado]

🔄 Integración con n8n
n8n automatiza la carga y actualización de documentos para el RAG. Los flujos se activan mediante triggers (como webhooks o programaciones), permitiendo que el asistente incorpore nuevo contenido sin intervención manual, mejorando la precisión de las respuestas.

⚙️ Variables de Entorno
OPENAI_API_KEY: Clave para autenticar con la API de OpenAI.
VECTOR_DB_KEY: Clave para el almacenamiento vectorial (si aplica).
NODE_ENV: Defina el entorno (desarrollo o producción).

📚 Documentación:
Para una documentación técnica detallada, consulte el archivo DOCUMENTACION.md.

👩‍💻 Autoría
Proyecto desarrollado por Guadalupe Diana Rubí Barahona Casia para el curso Desarrrollo Web en UMG.
