const { obtenerConexion, mysql } = require('../config/database');

class ComentarioModel {
  static async obtenerPorOpinion(idOpinion) {
    try {
      const pool = await obtenerConexion();
      const [filas] = await pool.execute(`
        SELECT
          c.*,
          u.nombre_usuario,
          u.imagen_perfil
        FROM comentarios c
        LEFT JOIN usuarios u ON c.id_autor = u.id_usuario
        WHERE c.id_opinion = ? AND c.activo = 1
        ORDER BY c.fecha_publicacion ASC
      `, [idOpinion]);
      return filas;
    } catch (error) {
      throw error;
    }
  }

  static async obtenerPorId(id) {
    try {
      const pool = await obtenerConexion();
      const [filas] = await pool.execute(`
        SELECT
          c.*,
          u.nombre_usuario,
          u.imagen_perfil
        FROM comentarios c
        LEFT JOIN usuarios u ON c.id_autor = u.id_usuario
        WHERE c.id_comentario = ? AND c.activo = 1
      `, [id]);
      return filas[0];
    } catch (error) {
      throw error;
    }
  }

  static async obtenerRecientes(limit = 10) {
    try {
      const pool = await obtenerConexion();
      const [filas] = await pool.execute(`
        SELECT
          c.*,
          u.nombre_usuario,
          o.titulo as titulo_opinion
        FROM comentarios c
        LEFT JOIN usuarios u ON c.id_autor = u.id_usuario
        LEFT JOIN opiniones o ON c.id_opinion = o.id_opinion
        WHERE c.activo = 1
        ORDER BY c.fecha_publicacion DESC
        LIMIT ?
      `, [limit]);
      return filas;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ComentarioModel;
