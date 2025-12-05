const CategoriaModel = require('../models/categoriaModel');

class CategoriaController {
  static async obtenerTodos(req, res) {
    try {
      const categorias = await CategoriaModel.obtenerTodos();
      res.json({
        exito: true,
        datos: categorias,
        cantidad: categorias.length
      });
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      res.status(500).json({
        exito: false,
        mensaje: 'Error al obtener las categorías',
        error: error.message
      });
    }
  }

  static async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      const categoria = await CategoriaModel.obtenerPorId(id);

      if (!categoria) {
        return res.status(404).json({
          exito: false,
          mensaje: 'Categoría no encontrada'
        });
      }

      res.json({
        exito: true,
        datos: categoria
      });
    } catch (error) {
      console.error('Error al obtener categoría:', error);
      res.status(500).json({
        exito: false,
        mensaje: 'Error al obtener la categoría',
        error: error.message
      });
    }
  }

  static async obtenerConConteo(req, res) {
    try {
      const categorias = await CategoriaModel.obtenerConConteo();
      res.json({
        exito: true,
        datos: categorias,
        cantidad: categorias.length
      });
    } catch (error) {
      console.error('Error al obtener categorías con conteo:', error);
      res.status(500).json({
        exito: false,
        mensaje: 'Error al obtener las categorías',
        error: error.message
      });
    }
  }
}

module.exports = CategoriaController;
