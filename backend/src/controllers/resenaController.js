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
        error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno del servidor'
      });
    }
  }

  static async obtenerPorId(req, res) {
    try {
      const { id } = req.params;

      // Validar que el ID sea un número
      if (!id || isNaN(id)) {
        return res.status(400).json({
          exito: false,
          mensaje: 'ID inválido'
        });
      }

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
        error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno del servidor'
      });
    }
  }

  static async obtenerPorJuego(req, res) {
    try {
      const { idJuego } = req.params;

      // Validar que el ID sea un número
      if (!idJuego || isNaN(idJuego)) {
        return res.status(400).json({
          exito: false,
          mensaje: 'ID de juego inválido'
        });
      }

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
        error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno del servidor'
      });
    }
  }

  static async obtenerMejorCalificadas(req, res) {
    try {
      const limite = parseInt(req.query.limite) || 10;

      // Validar límite
      if (limite < 1 || limite > 100) {
        return res.status(400).json({
          exito: false,
          mensaje: 'El límite debe estar entre 1 y 100'
        });
      }

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
        error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno del servidor'
      });
    }
  }

  static async crear(req, res) {
    try {
      const resenaData = req.body;

      // Validación de campos requeridos
      if (!resenaData.nombre_juego) {
        return res.status(400).json({
          exito: false,
          mensaje: 'El nombre del juego es requerido'
        });
      }

      if (!resenaData.contenido) {
        return res.status(400).json({
          exito: false,
          mensaje: 'El contenido es requerido'
        });
      }

      if (!resenaData.calificacion_general || resenaData.calificacion_general < 0 || resenaData.calificacion_general > 10) {
        return res.status(400).json({
          exito: false,
          mensaje: 'La calificación general debe estar entre 0 y 10'
        });
      }

      const id = await ResenaModel.crear(resenaData);
      
      res.status(201).json({
        exito: true,
        mensaje: 'Reseña creada exitosamente',
        datos: { id }
      });
    } catch (error) {
      console.error('Error al crear reseña:', error);
      res.status(500).json({
        exito: false,
        mensaje: 'Error al crear la reseña',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno del servidor'
      });
    }
  }

  static async actualizar(req, res) {
    try {
      const { id } = req.params;
      const resenaData = req.body;

      // Validar ID
      if (!id || isNaN(id)) {
        return res.status(400).json({
          exito: false,
          mensaje: 'ID inválido'
        });
      }

      // Validación de campos si están presentes
      if (resenaData.calificacion_general && (resenaData.calificacion_general < 0 || resenaData.calificacion_general > 10)) {
        return res.status(400).json({
          exito: false,
          mensaje: 'La calificación general debe estar entre 0 y 10'
        });
      }

      const actualizado = await ResenaModel.actualizar(id, resenaData);
      
      if (!actualizado) {
        return res.status(404).json({
          exito: false,
          mensaje: 'Reseña no encontrada o no se pudo actualizar'
        });
      }

      res.json({
        exito: true,
        mensaje: 'Reseña actualizada exitosamente'
      });
    } catch (error) {
      console.error('Error al actualizar reseña:', error);
      res.status(500).json({
        exito: false,
        mensaje: 'Error al actualizar la reseña',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno del servidor'
      });
    }
  }

  static async eliminar(req, res) {
    try {
      const { id } = req.params;

      // Validar ID
      if (!id || isNaN(id)) {
        return res.status(400).json({
          exito: false,
          mensaje: 'ID inválido'
        });
      }

      const eliminado = await ResenaModel.eliminar(id);
      
      if (!eliminado) {
        return res.status(404).json({
          exito: false,
          mensaje: 'Reseña no encontrada'
        });
      }

      res.json({
        exito: true,
        mensaje: 'Reseña eliminada exitosamente'
      });
    } catch (error) {
      console.error('Error al eliminar reseña:', error);
      res.status(500).json({
        exito: false,
        mensaje: 'Error al eliminar la reseña',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno del servidor'
      });
    }
  }
}

module.exports = ResenaController;