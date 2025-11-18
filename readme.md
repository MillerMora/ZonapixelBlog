# 🎮 ZonapixelBlog — Blog de videojuegos

Bienvenido a ZonapixelBlog, tu fuente de noticias, reseñas y contenido sobre videojuegos.

## 📋 Descripción

ZonapixelBlog es una plataforma web diseñada para compartir contenido relacionado con videojuegos, incluyendo:
- Reseñas de juegos
- Artículos y noticias de la industria
- Opiniones de la comunidad
- Entrevistas

## 🛠️ Tecnologías

- HTML5 — Estructura de las páginas web
- CSS3 — Estilos y diseño responsivo
- Bootstrap 5 — Framework CSS para componentes y layout

## 📁 Estructura del proyecto

```
ZonapixelBlog/
├── backend/
│   └── src/
│       ├── config/        # Configuraciones del servidor / DB
│       ├── controllers/   # Lógica de controladores
│       ├── models/        # Modelos de datos
│       └── routers/       # Rutas/API
├── frontend/
│   └── public/
│       └── src/
│           ├── assets/    # Imágenes y media
│           ├── css/
|           |   └── style.css       # Hojas de estilo
│           ├── js/        # Scripts del cliente
│           └── views/     # Vistas/HTML (index, reseñas, artículos etc.)
└── readme.md
```

Notas rápidas:
- El frontend está en frontend/public/src. Abre `index.html` o las vistas en `views/` en tu navegador para revisar la UI.
- El backend está en backend/src; revisa `config`, `controllers`, `models` y `routers` para la lógica del servidor y la API.

## 🚀 Instalación y uso rápido

1. Clona el repositorio:
   git clone <URL_DEL_REPOSITORIO>
2. Revisa el frontend:
   - Abre `frontend/public/src/views/index.html` (o `frontend/public/src/index.html` si existe) en tu navegador.
3. Revisa el backend:
   - Abre `backend/src/` para ver la implementación del servidor (instalación / ejecución depende del stack utilizado — p. ej. Node.js/Express).

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