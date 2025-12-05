# 🎮 ZonapixelBlog — Blog de videojuegos

Bienvenido a ZonapixelBlog, tu fuente de noticias, reseñas y contenido sobre videojuegos.

## 📋 Descripción

ZonapixelBlog es una plataforma web diseñada para compartir contenido relacionado con videojuegos, incluyendo:
- Reseñas de juegos
- Artículos y noticias de la industria
- Opiniones de la comunidad
- Entrevistas

## 🛠️ Tecnologías

- **Frontend:**
  - HTML5 — Estructura de las páginas web
  - CSS3 — Estilos y diseño responsivo
  - Bootstrap 5 — Framework CSS para componentes y layout
- **Backend:**
  - Node.js — Entorno de ejecución para JavaScript en el servidor
  - Express.js — Framework web para Node.js
  - MSSQL — Base de datos relacional
  - dotenv — Gestión de variables de entorno
  - CORS — Manejo de solicitudes cross-origin

## 📁 Estructura del proyecto

```
ZonapixelBlog/
├── .gitignore
├── readme.md
├── zonapixel_db.sql
├── backend/
│   ├── package.json
│   ├── package-lock.json
│   ├── .env
│   └── src/
│       ├── app.js
│       ├── config/
│       │   └── database.js    # Configuraciones de la base de datos
│       ├── controllers/       # Lógica de controladores
│       │   ├── articuloController.js
│       │   ├── categoriaController.js
│       │   ├── comentarioController.js
│       │   ├── entrevistaController.js
│       │   └── opinionController.js
│       ├── models/            # Modelos de datos
│       │   ├── articuloModel.js
│       │   ├── categoriaModel.js
│       │   ├── comentarioModel.js
│       │   ├── entrevistaModel.js
│       │   ├── juegoModel.js
│       │   ├── opinionModel.js
│       │   └── resenaModel.js
│       └── routers/
│           └── router.js      # Rutas/API
└── frontend/
    ├── js/
    └── public/
        └── src/
            ├── css/
            │   └── style.css  # Hojas de estilo
            └── views/         # Vistas/HTML
                ├── index.html
                ├── articulo.html
                ├── articulos.html
                ├── crear_opinion.html
                ├── entrevista.html
                ├── entrevistas.html
                ├── opinion.html
                ├── opiniones.html
                ├── resena.html
                └── resenas.html
```

Notas rápidas:
- El frontend está en frontend/public/src. Abre `index.html` o las vistas en `views/` en tu navegador para revisar la UI.
- El backend está en backend/src; revisa `config`, `controllers`, `models` y `routers` para la lógica del servidor y la API.

## 🚀 Instalación y uso rápido

1. Clona el repositorio:
   git clone <URL_DEL_REPOSITORIO>
2. Configura la base de datos:
   - Ejecuta el script `zonapixel_db.sql` en tu servidor MSSQL para crear la base de datos y tablas.
   - Configura las variables de entorno en `backend/.env` (copia de `.env.example` si existe).
3. Instala dependencias del backend:
   - Navega a `backend/` y ejecuta `npm install`.
4. Ejecuta el backend:
   - En `backend/`, ejecuta `npm run dev` para iniciar el servidor en modo desarrollo.
5. Revisa el frontend:
   - Abre `frontend/public/src/views/index.html` en tu navegador para ver la interfaz de usuario.

## 🤝 Contribución

1. Haz un fork del proyecto.
2. Crea tu rama de característica: `git checkout -b feature/NombreCaracterística`.
3. Haz commit de tus cambios: `git commit -m "Add: descripción de la mejora"`.
4. Haz push a la rama: `git push origin feature/NombreCaracterística`.
5. Abre un Pull Request.

## 📝 Licencia

Este proyecto está bajo la Licencia MIT — consulta el archivo `LICENSE` para más detalles.

## 👥 Autores

- Miller Mora — https://github.com/MillerMora