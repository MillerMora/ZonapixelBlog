const ResenaModel = require('../models/resenaModel');

class ResenaController {
  static async obtenerTodos(req, res) {
    try {
      const resenas = await ResenaModel.obtenerTodos();
      res.json({
        exito: true,
        datos: resenas,
        cantidad: resenas.length
      });
    } catch (error) {
      console.error('Error al obtener reseñas:', error);
      res.status(500).json({
        exito: false,
        mensaje: 'Error al obtener las reseñas',
        error: error.message
      });
    }
  }

  static async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      const resena = await ResenaModel.obtenerPorId(id);

      if (!resena) {
        return res.status(404).json({
          exito: false,
          mensaje: 'Reseña no encontrada'
        });
      }

      res.json({
        exito: true,
        datos: resena
      });
    } catch (error) {
      console.error('Error al obtener reseña:', error);
      res.status(500).json({
        exito: false,
        mensaje: 'Error al obtener la reseña',
        error: error.message
      });
    }
  }

  static async obtenerPorJuego(req, res) {
    try {
      const { idJuego } = req.params;
      const resenas = await ResenaModel.obtenerPorJuego(idJuego);

      res.json({
        exito: true,
        datos: resenas,
        cantidad: resenas.length
      });
    } catch (error) {
      console.error('Error al obtener reseñas por juego:', error);
      res.status(500).json({
        exito: false,
        mensaje: 'Error al obtener las reseñas',
        error: error.message
      });
    }
  }

  static async obtenerMejorCalificadas(req, res) {
    try {
      const limite = req.query.limite || 10;
      const resenas = await ResenaModel.obtenerMejorCalificadas(limite);

      res.json({
        exito: true,
        datos: resenas,
        cantidad: resenas.length
      });
    } catch (error) {
      console.error('Error al obtener reseñas mejor calificadas:', error);
      res.status(500).json({
        exito: false,
        mensaje: 'Error al obtener las reseñas',
        error: error.message
      });
    }
  }
}

module.exports = ResenaController;
