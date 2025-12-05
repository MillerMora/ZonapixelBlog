const ArticuloModel = require('../models/articuloModel');

class ArticuloController {
  static async obtenerTodos(req, res) {
    try {
      const articulos = await ArticuloModel.obtenerTodos();
      res.json({
        success: true,
        data: articulos,
        count: articulos.length
      });
    } catch (error) {
      console.error('Error al obtener artículos:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener los artículos',
        error: error.message
      });
    }
  }

  static async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      const articulo = await ArticuloModel.obtenerPorId(id);

      if (!articulo) {
        return res.status(404).json({
          success: false,
          message: 'Artículo no encontrado'
        });
      }

      res.json({
        success: true,
        data: articulo
      });
    } catch (error) {
      console.error('Error al obtener artículo:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener el artículo',
        error: error.message
      });
    }
  }

  static async obtenerPorCategoria(req, res) {
    try {
      const { idCategoria } = req.params;
      const articulos = await ArticuloModel.obtenerPorCategoria(idCategoria);

      res.json({
        success: true,
        data: articulos,
        count: articulos.length
      });
    } catch (error) {
      console.error('Error al obtener artículos por categoría:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener los artículos',
        error: error.message
      });
    }
  }

  static async obtenerRecientes(req, res) {
    try {
      const limit = req.query.limit || 5;
      const articulos = await ArticuloModel.obtenerRecientes(limit);

      res.json({
        success: true,
        data: articulos,
        count: articulos.length
      });
    } catch (error) {
      console.error('Error al obtener artículos recientes:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener los artículos',
        error: error.message
      });
    }
  }
}

module.exports = ArticuloController;