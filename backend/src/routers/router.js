const express = require('express');
const router = express.Router();

const articuloController = require('../controllers/articuloController');
const categoriaController = require('../controllers/categoriaController');
const entrevistaController = require('../controllers/entrevistaController');
const comentarioController = require('../controllers/comentarioController');
const opinionController = require('../controllers/opinionController');

router.get('/articulos', articuloController.obtenerArticulos);
router.get('/articulos/:id', articuloController.obtenerArticuloPorId);
router.get('/articulos/autor/:idAutor', articuloController.obtenerArticulosPorAutor);

router.get('/categorias', categoriaController.obtenerCategorias);
router.get('/categorias/:id', categoriaController.obtenerCategoriaPorId);

router.get('/entrevistas', entrevistaController.obtenerEntrevistas);
router.get('/entrevistas/:id', entrevistaController.obtenerEntrevistaPorId);
router.get('/entrevistas/autor/:idAutor', entrevistaController.obtenerEntrevistasPorAutor);

router.get('/comentarios', comentarioController.obtenerComentarios);
router.get('/comentarios/:id', comentarioController.obtenerComentarioPorId);
router.get('/comentarios/opinion/:idOpinion', comentarioController.obtenerComentariosPorOpinion);

router.get('/opiniones', opinionController.obtenerOpiniones);
router.get('/opiniones/:id', opinionController.obtenerOpinionPorId);
router.get('/opiniones/autor/:idAutor', opinionController.obtenerOpinionesPorAutor);
router.get('/opiniones/juego/:idJuego', opinionController.obtenerOpinionesPorJuego);

module.exports = router;
