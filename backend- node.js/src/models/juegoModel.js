const { obtenerConexion, mysql } = require('../config/database');

class JuegoModel {
  static async obtenerTodos() {
    try {
      const pool = await obtenerConexion();
      const [filas] = await pool.execute(`
        SELECT
          id_juego,
          nombre_juego,
          descripcion,
          desarrollador,
          fecha_lanzamiento,
          plataformas,
          imagen_portada,
          fecha_creacion,
          activo
        FROM juegos
        WHERE activo = 1
        ORDER BY nombre_juego ASC
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
        SELECT * FROM juegos
        WHERE id_juego = ? AND activo = 1
      `, [id]);
      return filas[0];
    } catch (error) {
      throw error;
    }
  }

  static async obtenerRecientes(limite = 10) {
    try {
      const pool = await obtenerConexion();
      const [filas] = await pool.execute(`
        SELECT *
        FROM juegos
        WHERE activo = 1
        ORDER BY fecha_lanzamiento DESC
        LIMIT ?
      `, [limite]);
      return filas;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = JuegoModel;
