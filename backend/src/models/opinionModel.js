const { obtenerConexion, mysql } = require('../config/database');

class OpinionModel {
  static async obtenerTodos() {
    try {
      const pool = await obtenerConexion();
      const [filas] = await pool.execute(`
        SELECT * FROM vista_opiniones_calificadas
        WHERE activo = 1
        ORDER BY fecha_publicacion DESC
      `);
      return filas;
    } catch (error) {
      throw error;
    }
  }

  static async obtenerPorId(id) {
    try {
      const pool = await obtenerConexion();
      const [filas] = await pool.execute(`
        SELECT * FROM vista_opiniones_calificadas
        WHERE id_opinion = ? AND activo = 1
      `, [id]);
      return filas[0] || null;
    } catch (error) {
      throw error;
    }
  }

  static async obtenerPorUsuario(idUsuario) {
    try {
      const pool = await obtenerConexion();
      const [filas] = await pool.execute(`
        SELECT * FROM vista_opiniones_calificadas
        WHERE id_autor = ? AND activo = 1
        ORDER BY fecha_publicacion DESC
      `, [idUsuario]);
      return filas;
    } catch (error) {
      throw error;
    }
  }

  static async obtenerPopulares(limite = 10) {
    try {
      const pool = await obtenerConexion();
      const [filas] = await pool.execute(`
        SELECT *
        FROM vista_opiniones_calificadas
        WHERE activo = 1
        ORDER BY total_calificaciones DESC, calificacion_promedio DESC, fecha_publicacion DESC
        LIMIT ?
      `, [parseInt(limite)]);
      return filas;
    } catch (error) {
      throw error;
    }
  }

  static async crear(data, idUsuario) {
    try {
      const pool = await obtenerConexion();
      const { 
        titulo, 
        contenido, 
        id_categoria, 
        id_juego, 
        calificacion_estrellas, 
        imagen_principal 
      } = data;

      // Validación de campos requeridos
      if (!titulo || !contenido) {
        throw new Error('Faltan campos requeridos');
      }

      // Validar calificación
      if (calificacion_estrellas && (calificacion_estrellas < 0 || calificacion_estrellas > 5)) {
        throw new Error('La calificación debe estar entre 0 y 5');
      }

      const [resultado] = await pool.execute(`
        INSERT INTO opiniones (
          titulo, 
          contenido, 
          id_autor, 
          id_categoria, 
          id_juego, 
          calificacion_estrellas, 
          imagen_principal,
          activo
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 1)
      `, [
        titulo, 
        contenido, 
        idUsuario, 
        id_categoria || null, 
        id_juego || null, 
        calificacion_estrellas || null, 
        imagen_principal || null
      ]);
      
      return resultado.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async actualizar(id, data, idUsuario) {
    try {
      const pool = await obtenerConexion();
      const { 
        titulo, 
        contenido, 
        id_categoria, 
        id_juego, 
        calificacion_estrellas, 
        imagen_principal 
      } = data;

      // Validación de campos requeridos
      if (!titulo || !contenido) {
        throw new Error('Faltan campos requeridos');
      }

      // Validar calificación
      if (calificacion_estrellas && (calificacion_estrellas < 0 || calificacion_estrellas > 5)) {
        throw new Error('La calificación debe estar entre 0 y 5');
      }

      const [resultado] = await pool.execute(`
        UPDATE opiniones
        SET 
          titulo = ?, 
          contenido = ?, 
          id_categoria = ?, 
          id_juego = ?, 
          calificacion_estrellas = ?, 
          imagen_principal = ?, 
          fecha_modificacion = CURRENT_TIMESTAMP
        WHERE id_opinion = ? AND id_autor = ? AND activo = 1
      `, [
        titulo, 
        contenido, 
        id_categoria || null, 
        id_juego || null, 
        calificacion_estrellas || null, 
        imagen_principal || null, 
        id, 
        idUsuario
      ]);
      
      return resultado.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async eliminar(id, idUsuario) {
    try {
      const pool = await obtenerConexion();
      const [resultado] = await pool.execute(`
        UPDATE opiniones
        SET activo = 0, fecha_modificacion = CURRENT_TIMESTAMP
        WHERE id_opinion = ? AND id_autor = ? AND activo = 1
      `, [id, idUsuario]);
      
      return resultado.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = OpinionModel;