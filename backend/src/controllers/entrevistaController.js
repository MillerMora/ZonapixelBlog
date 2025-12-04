const entrevistaModel = require('../models/entrevistaModel');

const obtenerEntrevistas = async (req, res) => {
    try {
        const entrevistas = await entrevistaModel.obtenerEntrevistas();
        res.json({
            success: true,
            data: entrevistas,
            message: 'Entrevistas obtenidas exitosamente'
        });
    } catch (error) {
        console.error('Error al obtener entrevistas:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

const obtenerEntrevistaPorId = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID de entrevista inválido'
            });
        }

        const entrevista = await entrevistaModel.obtenerEntrevistaPorId(parseInt(id));

        if (!entrevista) {
            return res.status(404).json({
                success: false,
                message: 'Entrevista no encontrada'
            });
        }

        await entrevistaModel.incrementarVistasEntrevista(parseInt(id));

        res.json({
            success: true,
            data: entrevista,
            message: 'Entrevista obtenida exitosamente'
        });
    } catch (error) {
        console.error('Error al obtener entrevista:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

const obtenerEntrevistasPorAutor = async (req, res) => {
    try {
        const { idAutor } = req.params;

        if (!idAutor || isNaN(idAutor)) {
            return res.status(400).json({
                success: false,
                message: 'ID de autor inválido'
            });
        }

        const entrevistas = await entrevistaModel.obtenerEntrevistasPorAutor(parseInt(idAutor));

        res.json({
            success: true,
            data: entrevistas,
            message: 'Entrevistas del autor obtenidas exitosamente'
        });
    } catch (error) {
        console.error('Error al obtener entrevistas por autor:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

module.exports = {
    obtenerEntrevistas,
    obtenerEntrevistaPorId,
    obtenerEntrevistasPorAutor
};
