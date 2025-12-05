const EntrevistaModel = require('../models/entrevistaModel');

class EntrevistaController {
  static async obtenerTodos(req, res) {
    try {
      const entrevistas = await EntrevistaModel.obtenerTodos();
      res.json({
        exito: true,
        datos: entrevistas,
        cantidad: entrevistas.length
      });
    } catch (error) {
      console.error('Error al obtener entrevistas:', error);
      res.status(500).json({
        exito: false,
        mensaje: 'Error al obtener las entrevistas',
        error: error.message
      });
    }
  }

  static async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      const entrevista = await EntrevistaModel.obtenerPorId(id);

      if (!entrevista) {
        return res.status(404).json({
          exito: false,
          mensaje: 'Entrevista no encontrada'
        });
      }

      res.json({
        exito: true,
        datos: entrevista
      });
    } catch (error) {
      console.error('Error al obtener entrevista:', error);
      res.status(500).json({
        exito: false,
        mensaje: 'Error al obtener la entrevista',
        error: error.message
      });
    }
  }

  static async obtenerRecientes(req, res) {
    try {
      const limite = req.query.limite || 5;
      const entrevistas = await EntrevistaModel.obtenerRecientes(limite);

      res.json({
        exito: true,
        datos: entrevistas,
        cantidad: entrevistas.length
      });
    } catch (error) {
      console.error('Error al obtener entrevistas recientes:', error);
      res.status(500).json({
        exito: false,
        mensaje: 'Error al obtener las entrevistas',
        error: error.message
      });
    }
  }
}

module.exports = EntrevistaController;
