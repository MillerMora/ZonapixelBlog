const opinionModel = require('../models/opinionModel');

const obtenerOpiniones = async (req, res) => {
    try {
        const opiniones = await opinionModel.obtenerOpiniones();
        res.json({
            success: true,
            data: opiniones,
            message: 'Opiniones obtenidas exitosamente'
        });
    } catch (error) {
        console.error('Error al obtener opiniones:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

const obtenerOpinionPorId = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID de opinión inválido'
            });
        }

        const opinion = await opinionModel.obtenerOpinionPorId(parseInt(id));

        if (!opinion) {
            return res.status(404).json({
                success: false,
                message: 'Opinión no encontrada'
            });
        }

        res.json({
            success: true,
            data: opinion,
            message: 'Opinión obtenida exitosamente'
        });
    } catch (error) {
        console.error('Error al obtener opinión:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

const obtenerOpinionesPorAutor = async (req, res) => {
    try {
        const { idAutor } = req.params;

        if (!idAutor || isNaN(idAutor)) {
            return res.status(400).json({
                success: false,
                message: 'ID de autor inválido'
            });
        }

        const opiniones = await opinionModel.obtenerOpinionesPorAutor(parseInt(idAutor));

        res.json({
            success: true,
            data: opiniones,
            message: 'Opiniones del autor obtenidas exitosamente'
        });
    } catch (error) {
        console.error('Error al obtener opiniones por autor:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

const obtenerOpinionesPorJuego = async (req, res) => {
    try {
        const { idJuego } = req.params;

        if (!idJuego || isNaN(idJuego)) {
            return res.status(400).json({
                success: false,
                message: 'ID de juego inválido'
            });
        }

        const opiniones = await opinionModel.obtenerOpinionesPorJuego(parseInt(idJuego));

        res.json({
            success: true,
            data: opiniones,
            message: 'Opiniones del juego obtenidas exitosamente'
        });
    } catch (error) {
        console.error('Error al obtener opiniones por juego:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

module.exports = {
    obtenerOpiniones,
    obtenerOpinionPorId,
    obtenerOpinionesPorAutor,
    obtenerOpinionesPorJuego
};
