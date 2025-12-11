const express = require('express');
const router = express.Router();
const ArticuloController = require('../controllers/articuloController');
const CategoriaController = require('../controllers/categoriaController');
const ComentarioController = require('../controllers/comentarioController');
const EntrevistaController = require('../controllers/entrevistaController');
const OpinionController = require('../controllers/opinionController');
const JuegoController = require('../controllers/juegoController');
const ResenaController = require('../controllers/resenaController');

// ==================== RUTAS DE ARTÍCULOS ====================
router.get('/articulos', ArticuloController.obtenerTodos);
router.get('/articulos/recientes', ArticuloController.obtenerRecientes);
router.get('/articulos/:id', ArticuloController.obtenerPorId);
router.get('/articulos/categoria/:idCategoria', ArticuloController.obtenerPorCategoria);

// ==================== RUTAS DE CATEGORÍAS ====================
router.get('/categorias', CategoriaController.obtenerTodos);
router.get('/categorias/conteo', CategoriaController.obtenerConConteo);
router.get('/categorias/:id', CategoriaController.obtenerPorId);

// ==================== RUTAS DE JUEGOS ====================
router.get('/juegos', JuegoController.obtenerTodos);
router.get('/juegos/recientes', JuegoController.obtenerRecientes);
router.get('/juegos/:id', JuegoController.obtenerPorId);

// ==================== RUTAS DE RESEÑAS ====================
router.get('/resenas', ResenaController.obtenerTodos);
router.get('/resenas/mejor-calificadas', ResenaController.obtenerMejorCalificadas);
router.get('/resenas/:id', ResenaController.obtenerPorId);
router.get('/resenas/juego/:idJuego', ResenaController.obtenerPorJuego);
router.post('/resenas', ResenaController.crear);
router.put('/resenas/:id', ResenaController.actualizar);
router.delete('/resenas/:id', ResenaController.eliminar);

// ==================== RUTAS DE ENTREVISTAS ====================
router.get('/entrevistas', EntrevistaController.obtenerTodos);
router.get('/entrevistas/recientes', EntrevistaController.obtenerRecientes);
router.get('/entrevistas/:id', EntrevistaController.obtenerPorId);
router.post('/entrevistas', EntrevistaController.crear);
router.put('/entrevistas/:id', EntrevistaController.actualizar);
router.delete('/entrevistas/:id', EntrevistaController.eliminar);

// ==================== RUTAS DE OPINIONES ====================
router.get('/opiniones', OpinionController.obtenerTodos);
router.get('/opiniones/populares', OpinionController.obtenerPopulares);
router.get('/opiniones/:id', OpinionController.obtenerPorId);
router.get('/opiniones/usuario/:idUsuario', OpinionController.obtenerPorUsuario);
router.post('/opiniones', OpinionController.crear);
router.put('/opiniones/:id', OpinionController.actualizar);
router.delete('/opiniones/:id', OpinionController.eliminar);

// ==================== RUTAS DE COMENTARIOS ====================
router.get('/comentarios/recientes', ComentarioController.obtenerRecientes);
router.get('/comentarios/:id', ComentarioController.obtenerPorId);
router.get('/comentarios/opinion/:idOpinion', ComentarioController.obtenerPorOpinion);

// ==================== RUTA DE BIENVENIDA ====================
router.get('/', (req, res) => {
  res.json({
    message: 'API ZonaPixel - Bienvenido',
    version: '1.0.0',
    endpoints: {
      articulos: {
        obtenerTodos: 'GET /api/articulos',
        obtenerRecientes: 'GET /api/articulos/recientes',
        obtenerPorId: 'GET /api/articulos/:id',
        obtenerPorCategoria: 'GET /api/articulos/categoria/:idCategoria'
      },
      categorias: {
        obtenerTodos: 'GET /api/categorias',
        obtenerConConteo: 'GET /api/categorias/conteo',
        obtenerPorId: 'GET /api/categorias/:id'
      },
      juegos: {
        obtenerTodos: 'GET /api/juegos',
        obtenerRecientes: 'GET /api/juegos/recientes',
        obtenerPorId: 'GET /api/juegos/:id'
      },
      resenas: {
        obtenerTodos: 'GET /api/resenas',
        obtenerMejorCalificadas: 'GET /api/resenas/mejor-calificadas',
        obtenerPorId: 'GET /api/resenas/:id',
        obtenerPorJuego: 'GET /api/resenas/juego/:idJuego',
        crear: 'POST /api/resenas',
        actualizar: 'PUT /api/resenas/:id',
        eliminar: 'DELETE /api/resenas/:id'
      },
      entrevistas: {
        obtenerTodos: 'GET /api/entrevistas',
        obtenerRecientes: 'GET /api/entrevistas/recientes',
        obtenerPorId: 'GET /api/entrevistas/:id',
        crear: 'POST /api/entrevistas',
        actualizar: 'PUT /api/entrevistas/:id',
        eliminar: 'DELETE /api/entrevistas/:id'
      },
      opiniones: {
        obtenerTodos: 'GET /api/opiniones',
        obtenerPopulares: 'GET /api/opiniones/populares',
        obtenerPorId: 'GET /api/opiniones/:id',
        obtenerPorUsuario: 'GET /api/opiniones/usuario/:idUsuario',
        crear: 'POST /api/opiniones',
        actualizar: 'PUT /api/opiniones/:id',
        eliminar: 'DELETE /api/opiniones/:id'
      },
      comentarios: {
        obtenerRecientes: 'GET /api/comentarios/recientes',
        obtenerPorId: 'GET /api/comentarios/:id',
        obtenerPorOpinion: 'GET /api/comentarios/opinion/:idOpinion'
      }
    }
  });
});

module.exports = router;