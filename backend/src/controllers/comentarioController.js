const comentarioModel = require('../models/comentarioModel');

const obtenerComentarios = async (req, res) => {
    try {
        const comentarios = await comentarioModel.obtenerComentarios();
        res.json({
            success: true,
            data: comentarios,
            message: 'Comentarios obtenidos exitosamente'
        });
    } catch (error) {
        console.error('Error al obtener comentarios:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

const obtenerComentariosPorOpinion = async (req, res) => {
    try {
        const { idOpinion } = req.params;

        if (!idOpinion || isNaN(idOpinion)) {
            return res.status(400).json({
                success: false,
                message: 'ID de opinión inválido'
            });
        }

        const comentarios = await comentarioModel.obtenerComentariosPorOpinion(parseInt(idOpinion));

        res.json({
            success: true,
            data: comentarios,
            message: 'Comentarios de la opinión obtenidos exitosamente'
        });
    } catch (error) {
        console.error('Error al obtener comentarios por opinión:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

const obtenerComentarioPorId = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID de comentario inválido'
            });
        }

        const comentario = await comentarioModel.obtenerComentarioPorId(parseInt(id));

        if (!comentario) {
            return res.status(404).json({
                success: false,
                message: 'Comentario no encontrado'
            });
        }

        res.json({
            success: true,
            data: comentario,
            message: 'Comentario obtenido exitosamente'
        });
    } catch (error) {
        console.error('Error al obtener comentario:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

module.exports = {
    obtenerComentarios,
    obtenerComentariosPorOpinion,
    obtenerComentarioPorId
};
