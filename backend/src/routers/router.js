const express = require('express');
const router = express.Router();

// Importar controladores
const ArticuloController = require('../controllers/articuloController');
const CategoriaController = require('../controllers/categoriaController');
const ComentarioController = require('../controllers/comentarioController');
const EntrevistaController = require('../controllers/entrevistaController');
const OpinionController = require('../controllers/opinionController');
const JuegoController = require('../controllers/juegoController');
const ResenaController = require('../controllers/resenaController');

// ========== RUTAS DE ARTÍCULOS ==========
router.get('/articulos', ArticuloController.obtenerTodos);
router.get('/articulos/recientes', ArticuloController.obtenerRecientes);
router.get('/articulos/:id', ArticuloController.obtenerPorId);
router.get('/articulos/categoria/:idCategoria', ArticuloController.obtenerPorCategoria);

// ========== RUTAS DE CATEGORÍAS ==========
router.get('/categorias', CategoriaController.obtenerTodos);
router.get('/categorias/conteo', CategoriaController.obtenerConConteo);
router.get('/categorias/:id', CategoriaController.obtenerPorId);

// ========== RUTAS DE JUEGOS ==========
router.get('/juegos', JuegoController.obtenerTodos);
router.get('/juegos/recientes', JuegoController.obtenerRecientes);
router.get('/juegos/:id', JuegoController.obtenerPorId);

// ========== RUTAS DE RESEÑAS ==========
router.get('/resenas', ResenaController.obtenerTodos);
router.get('/resenas/mejor-calificadas', ResenaController.obtenerMejorCalificadas);
router.get('/resenas/:id', ResenaController.obtenerPorId);
router.get('/resenas/juego/:idJuego', ResenaController.obtenerPorJuego);

// ========== RUTAS DE ENTREVISTAS ==========
router.get('/entrevistas', EntrevistaController.obtenerTodos);
router.get('/entrevistas/recientes', EntrevistaController.obtenerRecientes);
router.get('/entrevistas/:id', EntrevistaController.obtenerPorId);

// ========== RUTAS DE OPINIONES ==========
router.get('/opiniones', OpinionController.obtenerTodos);
router.get('/opiniones/populares', OpinionController.obtenerPopulares);
router.get('/opiniones/:id', OpinionController.obtenerPorId);
router.get('/opiniones/usuario/:idUsuario', OpinionController.obtenerPorUsuario);

// ========== RUTAS DE COMENTARIOS ==========
router.get('/comentarios/recientes', ComentarioController.obtenerRecientes);
router.get('/comentarios/:id', ComentarioController.obtenerPorId);
router.get('/comentarios/opinion/:idOpinion', ComentarioController.obtenerPorOpinion);

// Ruta raíz de la API
router.get('/', (req, res) => {
  res.json({
    message: 'API ZonaPixel - Bienvenido',
    version: '1.0.0',
    endpoints: {
      articulos: '/api/articulos',
      categorias: '/api/categorias',
      juegos: '/api/juegos',
      resenas: '/api/resenas',
      entrevistas: '/api/entrevistas',
      opiniones: '/api/opiniones',
      comentarios: '/api/comentarios'
    }
  });
});

module.exports = router;