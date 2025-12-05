const OpinionModel = require('../models/opinionModel');

class OpinionController {
  static async obtenerTodos(req, res) {
    try {
      const opiniones = await OpinionModel.obtenerTodos();
      res.json({
        exito: true,
        datos: opiniones,
        cantidad: opiniones.length
      });
    } catch (error) {
      console.error('Error al obtener opiniones:', error);
      res.status(500).json({
        exito: false,
        mensaje: 'Error al obtener las opiniones',
        error: error.message
      });
    }
  }

  static async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      const opinion = await OpinionModel.obtenerPorId(id);

      if (!opinion) {
        return res.status(404).json({
          exito: false,
          mensaje: 'Opinión no encontrada'
        });
      }

      res.json({
        exito: true,
        datos: opinion
      });
    } catch (error) {
      console.error('Error al obtener opinión:', error);
      res.status(500).json({
        exito: false,
        mensaje: 'Error al obtener la opinión',
        error: error.message
      });
    }
  }

  static async obtenerPorUsuario(req, res) {
    try {
      const { idUsuario } = req.params;
      const opiniones = await OpinionModel.obtenerPorUsuario(idUsuario);

      res.json({
        exito: true,
        datos: opiniones,
        cantidad: opiniones.length
      });
    } catch (error) {
      console.error('Error al obtener opiniones por usuario:', error);
      res.status(500).json({
        exito: false,
        mensaje: 'Error al obtener las opiniones',
        error: error.message
      });
    }
  }

  static async obtenerPopulares(req, res) {
    try {
      const limite = req.query.limite || 10;
      const opiniones = await OpinionModel.obtenerPopulares(limite);

      res.json({
        exito: true,
        datos: opiniones,
        cantidad: opiniones.length
      });
    } catch (error) {
      console.error('Error al obtener opiniones populares:', error);
      res.status(500).json({
        exito: false,
        mensaje: 'Error al obtener las opiniones',
        error: error.message
      });
    }
  }
}

module.exports = OpinionController;
