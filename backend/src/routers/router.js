const express = require('express');
const router = express.Router();

const ArticuloController = require('../controllers/articuloController');
const CategoriaController = require('../controllers/categoriaController');
const ComentarioController = require('../controllers/comentarioController');
const EntrevistaController = require('../controllers/entrevistaController');
const OpinionController = require('../controllers/opinionController');
const JuegoController = require('../controllers/juegoController');
const ResenaController = require('../controllers/resenaController');

router.get('/articulos', ArticuloController.obtenerTodos);
router.get('/articulos/recientes', ArticuloController.obtenerRecientes);
router.get('/articulos/:id', ArticuloController.obtenerPorId);
router.get('/articulos/categoria/:idCategoria', ArticuloController.obtenerPorCategoria);

router.get('/categorias', CategoriaController.obtenerTodos);
router.get('/categorias/conteo', CategoriaController.obtenerConConteo);
router.get('/categorias/:id', CategoriaController.obtenerPorId);

router.get('/juegos', JuegoController.obtenerTodos);
router.get('/juegos/recientes', JuegoController.obtenerRecientes);
router.get('/juegos/:id', JuegoController.obtenerPorId);

router.get('/resenas', ResenaController.obtenerTodos);
router.get('/resenas/mejor-calificadas', ResenaController.obtenerMejorCalificadas);
router.get('/resenas/:id', ResenaController.obtenerPorId);
router.get('/resenas/juego/:idJuego', ResenaController.obtenerPorJuego);

router.get('/entrevistas', EntrevistaController.obtenerTodos);
router.get('/entrevistas/recientes', EntrevistaController.obtenerRecientes);
router.get('/entrevistas/:id', EntrevistaController.obtenerPorId);

router.get('/opiniones', OpinionController.obtenerTodos);
router.get('/opiniones/populares', OpinionController.obtenerPopulares);
router.get('/opiniones/:id', OpinionController.obtenerPorId);
router.get('/opiniones/usuario/:idUsuario', OpinionController.obtenerPorUsuario);

router.get('/comentarios/recientes', ComentarioController.obtenerRecientes);
router.get('/comentarios/:id', ComentarioController.obtenerPorId);
router.get('/comentarios/opinion/:idOpinion', ComentarioController.obtenerPorOpinion);

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