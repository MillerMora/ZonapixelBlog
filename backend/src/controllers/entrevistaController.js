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
        error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno del servidor'
      });
    }
  }

  static async obtenerRecientes(req, res) {
    try {
      const limite = parseInt(req.query.limite) || 5;

      // Validar límite
      if (limite < 1 || limite > 100) {
        return res.status(400).json({
          exito: false,
          mensaje: 'El límite debe estar entre 1 y 100'
        });
      }

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

      if (!data.entrevistado) {
        return res.status(400).json({
          exito: false,
          mensaje: 'El nombre del entrevistado es requerido'
        });
      }

      if (!data.cargo_entrevistado) {
        return res.status(400).json({
          exito: false,
          mensaje: 'El cargo del entrevistado es requerido'
        });
      }

      const id = await EntrevistaModel.crear(data, idUsuario);
      
      res.status(201).json({
        exito: true,
        mensaje: 'Entrevista creada exitosamente',
        datos: { id }
      });
    } catch (error) {
      console.error('Error al crear entrevista:', error);
      res.status(500).json({
        exito: false,
        mensaje: 'Error al crear la entrevista',
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

      const actualizado = await EntrevistaModel.actualizar(id, data, idUsuario);
      
      if (!actualizado) {
        return res.status(404).json({
          exito: false,
          mensaje: 'Entrevista no encontrada o no tienes permisos para actualizarla'
        });
      }

      res.json({
        exito: true,
        mensaje: 'Entrevista actualizada exitosamente'
      });
    } catch (error) {
      console.error('Error al actualizar entrevista:', error);
      res.status(500).json({
        exito: false,
        mensaje: 'Error al actualizar la entrevista',
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

      const eliminado = await EntrevistaModel.eliminar(id, idUsuario);
      
      if (!eliminado) {
        return res.status(404).json({
          exito: false,
          mensaje: 'Entrevista no encontrada o no tienes permisos para eliminarla'
        });
      }

      res.json({
        exito: true,
        mensaje: 'Entrevista eliminada exitosamente'
      });
    } catch (error) {
      console.error('Error al eliminar entrevista:', error);
      res.status(500).json({
        exito: false,
        mensaje: 'Error al eliminar la entrevista',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno del servidor'
      });
    }
  }
}

module.exports = EntrevistaController;