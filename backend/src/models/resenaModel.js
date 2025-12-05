const { obtenerConexion, mysql } = require('../config/database');

class ResenaModel {
  static async obtenerTodos() {
    try {
      const pool = await obtenerConexion();
      const [filas] = await pool.execute(`
        SELECT * FROM vista_resenas_completas
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
        SELECT * FROM vista_resenas_completas
        WHERE id_resena = ? AND activo = 1
      `, [id]);
      return filas[0];
    } catch (error) {
      throw error;
    }
  }

  static async obtenerPorJuego(idJuego) {
    try {
      const pool = await obtenerConexion();
      const [filas] = await pool.execute(`
        SELECT * FROM vista_resenas_completas
        WHERE id_juego = ? AND activo = 1
        ORDER BY fecha_publicacion DESC
      `, [idJuego]);
      return filas;
    } catch (error) {
      throw error;
    }
  }

  static async obtenerMejorCalificadas(limite = 10) {
    try {
      const pool = await obtenerConexion();
      const [filas] = await pool.execute(`
        SELECT *
        FROM vista_resenas_completas
        WHERE activo = 1
        ORDER BY calificacion_general DESC, fecha_publicacion DESC
        LIMIT ?
      `, [limite]);
      return filas;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ResenaModel;
