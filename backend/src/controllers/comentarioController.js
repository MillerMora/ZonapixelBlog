const ComentarioModel = require('../models/comentarioModel');

class ComentarioController {
  static async obtenerPorOpinion(req, res) {
    try {
      const { idOpinion } = req.params;
      const comentarios = await ComentarioModel.obtenerPorOpinion(idOpinion);

      res.json({
        exito: true,
        datos: comentarios,
        cantidad: comentarios.length
      });
    } catch (error) {
      console.error('Error al obtener comentarios:', error);
      res.status(500).json({
        exito: false,
        mensaje: 'Error al obtener los comentarios',
        error: error.message
      });
    }
  }

  static async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      const comentario = await ComentarioModel.obtenerPorId(id);

      if (!comentario) {
        return res.status(404).json({
          exito: false,
          mensaje: 'Comentario no encontrado'
        });
      }

      res.json({
        exito: true,
        datos: comentario
      });
    } catch (error) {
      console.error('Error al obtener comentario:', error);
      res.status(500).json({
        exito: false,
        mensaje: 'Error al obtener el comentario',
        error: error.message
      });
    }
  }

  static async obtenerRecientes(req, res) {
    try {
      const limite = req.query.limite || 10;
      const comentarios = await ComentarioModel.obtenerRecientes(limite);

      res.json({
        exito: true,
        datos: comentarios,
        cantidad: comentarios.length
      });
    } catch (error) {
      console.error('Error al obtener comentarios recientes:', error);
      res.status(500).json({
        exito: false,
        mensaje: 'Error al obtener los comentarios',
        error: error.message
      });
    }
  }
}

module.exports = ComentarioController;
