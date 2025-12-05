const JuegoModel = require('../models/juegoModel');

class JuegoController {
  static async obtenerTodos(req, res) {
    try {
      const juegos = await JuegoModel.obtenerTodos();
      res.json({
        success: true,
        data: juegos,
        count: juegos.length
      });
    } catch (error) {
      console.error('Error al obtener juegos:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener los juegos',
        error: error.message
      });
    }
  }

  static async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      const juego = await JuegoModel.obtenerPorId(id);

      if (!juego) {
        return res.status(404).json({
          success: false,
          message: 'Juego no encontrado'
        });
      }

      res.json({
        success: true,
        data: juego
      });
    } catch (error) {
      console.error('Error al obtener juego:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener el juego',
        error: error.message
      });
    }
  }

  static async obtenerRecientes(req, res) {
    try {
      const limit = req.query.limit || 10;
      const juegos = await JuegoModel.obtenerRecientes(limit);

      res.json({
        success: true,
        data: juegos,
        count: juegos.length
      });
    } catch (error) {
      console.error('Error al obtener juegos recientes:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener los juegos',
        error: error.message
      });
    }
  }
}

module.exports = JuegoController;