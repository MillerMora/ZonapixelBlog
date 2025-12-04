const articuloModel = require('../models/articuloModel');

const obtenerArticulos = async (req, res) => {
    try {
        const articulos = await articuloModel.obtenerArticulos();
        res.json({
            success: true,
            data: articulos,
            message: 'Artículos obtenidos exitosamente'
        });
    } catch (error) {
        console.error('Error al obtener artículos:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

const obtenerArticuloPorId = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID de artículo inválido'
            });
        }

        const articulo = await articuloModel.obtenerArticuloPorId(parseInt(id));

        if (!articulo) {
            return res.status(404).json({
                success: false,
                message: 'Artículo no encontrado'
            });
        }

        await articuloModel.incrementarVistasArticulo(parseInt(id));

        res.json({
            success: true,
            data: articulo,
            message: 'Artículo obtenido exitosamente'
        });
    } catch (error) {
        console.error('Error al obtener artículo:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

const obtenerArticulosPorAutor = async (req, res) => {
    try {
        const { idAutor } = req.params;

        if (!idAutor || isNaN(idAutor)) {
            return res.status(400).json({
                success: false,
                message: 'ID de autor inválido'
            });
        }

        const articulos = await articuloModel.obtenerArticulosPorAutor(parseInt(idAutor));

        res.json({
            success: true,
            data: articulos,
            message: 'Artículos del autor obtenidos exitosamente'
        });
    } catch (error) {
        console.error('Error al obtener artículos por autor:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

module.exports = {
    obtenerArticulos,
    obtenerArticuloPorId,
    obtenerArticulosPorAutor
};
