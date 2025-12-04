const categoriaModel = require('../models/categoriaModel');

const obtenerCategorias = async (req, res) => {
    try {
        const categorias = await categoriaModel.obtenerCategorias();
        res.json({
            success: true,
            data: categorias,
            message: 'Categorías obtenidas exitosamente'
        });
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

const obtenerCategoriaPorId = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID de categoría inválido'
            });
        }

        const categoria = await categoriaModel.obtenerCategoriaPorId(parseInt(id));

        if (!categoria) {
            return res.status(404).json({
                success: false,
                message: 'Categoría no encontrada'
            });
        }

        res.json({
            success: true,
            data: categoria,
            message: 'Categoría obtenida exitosamente'
        });
    } catch (error) {
        console.error('Error al obtener categoría:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

module.exports = {
    obtenerCategorias,
    obtenerCategoriaPorId
};
