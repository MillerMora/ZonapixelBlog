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
        error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno del servidor'
      });
    }
  }

  static async obtenerPorUsuario(req, res) {
    try {
      const { idUsuario } = req.params;

      // Validar que el ID sea un número
      if (!idUsuario || isNaN(idUsuario)) {
        return res.status(400).json({
          exito: false,
          mensaje: 'ID de usuario inválido'
        });
      }

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
        error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno del servidor'
      });
    }
  }

  static async obtenerPopulares(req, res) {
    try {
      const limite = parseInt(req.query.limite) || 10;

      // Validar límite
      if (limite < 1 || limite > 100) {
        return res.status(400).json({
          exito: false,
          mensaje: 'El límite debe estar entre 1 y 100'
        });
      }

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
        error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno del servidor'
      });
    }
  }

  static async crear(req, res) {
    try {
      const data = req.body;
      const idUsuario = req.user?.id_usuario || 1; // Debe venir del middleware de autenticación

      // Validación de campos requeridos
      if (!data.titulo) {
        return res.status(400).json({
          exito: false,
          mensaje: 'El título es requerido'
        });
      }

      if (!data.contenido) {
        return res.status(400).json({
          exito: false,
          mensaje: 'El contenido es requerido'
        });
      }

      // Validar calificación si está presente
      if (data.calificacion_estrellas && (data.calificacion_estrellas < 0 || data.calificacion_estrellas > 5)) {
        return res.status(400).json({
          exito: false,
          mensaje: 'La calificación debe estar entre 0 y 5'
        });
      }

      const id = await OpinionModel.crear(data, idUsuario);
      
      res.status(201).json({
        exito: true,
        mensaje: 'Opinión creada exitosamente',
        datos: { id }
      });
    } catch (error) {
      console.error('Error al crear opinión:', error);
      res.status(500).json({
        exito: false,
        mensaje: 'Error al crear la opinión',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno del servidor'
      });
    }
  }

  static async actualizar(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;
      const idUsuario = req.user?.id_usuario || 1; // Debe venir del middleware de autenticación

      // Validar ID
      if (!id || isNaN(id)) {
        return res.status(400).json({
          exito: false,
          mensaje: 'ID inválido'
        });
      }

      // Validar calificación si está presente
      if (data.calificacion_estrellas && (data.calificacion_estrellas < 0 || data.calificacion_estrellas > 5)) {
        return res.status(400).json({
          exito: false,
          mensaje: 'La calificación debe estar entre 0 y 5'
        });
      }

      const actualizado = await OpinionModel.actualizar(id, data, idUsuario);
      
      if (!actualizado) {
        return res.status(404).json({
          exito: false,
          mensaje: 'Opinión no encontrada o no tienes permisos para actualizarla'
        });
      }

      res.json({
        exito: true,
        mensaje: 'Opinión actualizada exitosamente'
      });
    } catch (error) {
      console.error('Error al actualizar opinión:', error);
      res.status(500).json({
        exito: false,
        mensaje: 'Error al actualizar la opinión',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno del servidor'
      });
    }
  }

  static async eliminar(req, res) {
    try {
      const { id } = req.params;
      const idUsuario = req.user?.id_usuario || 1; // Debe venir del middleware de autenticación

      // Validar ID
      if (!id || isNaN(id)) {
        return res.status(400).json({
          exito: false,
          mensaje: 'ID inválido'
        });
      }

      const eliminado = await OpinionModel.eliminar(id, idUsuario);
      
      if (!eliminado) {
        return res.status(404).json({
          exito: false,
          mensaje: 'Opinión no encontrada o no tienes permisos para eliminarla'
        });
      }

      res.json({
        exito: true,
        mensaje: 'Opinión eliminada exitosamente'
      });
    } catch (error) {
      console.error('Error al eliminar opinión:', error);
      res.status(500).json({
        exito: false,
        mensaje: 'Error al eliminar la opinión',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno del servidor'
      });
    }
  }
}

module.exports = OpinionController;