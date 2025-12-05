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
      return filas[0];
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

  static async obtenerPopulares(limit = 10) {
    try {
      const pool = await obtenerConexion();
      const [filas] = await pool.execute(`
        SELECT *
        FROM vista_opiniones_calificadas
        WHERE activo = 1
        ORDER BY total_calificaciones DESC, calificacion_promedio DESC, fecha_publicacion DESC
        LIMIT ?
      `, [limit]);
      return filas;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = OpinionModel;
