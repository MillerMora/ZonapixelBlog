const { obtenerConexion, mysql } = require('../config/database');

class EntrevistaModel {
  static async obtenerTodos() {
    try {
      const pool = await obtenerConexion();
      const [filas] = await pool.execute(`
        SELECT
          e.*,
          u.nombre_usuario,
          u.imagen_perfil,
          c.nombre_categoria
        FROM entrevistas e
        LEFT JOIN usuarios u ON e.id_autor = u.id_usuario
        LEFT JOIN categorias c ON e.id_categoria = c.id_categoria
        WHERE e.activo = 1
        ORDER BY e.fecha_publicacion DESC
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
        SELECT
          e.*,
          u.nombre_usuario,
          u.imagen_perfil,
          c.nombre_categoria
        FROM entrevistas e
        LEFT JOIN usuarios u ON e.id_autor = u.id_usuario
        LEFT JOIN categorias c ON e.id_categoria = c.id_categoria
        WHERE e.id_entrevista = ? AND e.activo = 1
      `, [id]);
      return filas[0];
    } catch (error) {
      throw error;
    }
  }

  static async obtenerRecientes(limite = 5) {
    try {
      const pool = await obtenerConexion();
      const [filas] = await pool.execute(`
        SELECT
          e.*,
          u.nombre_usuario,
          c.nombre_categoria
        FROM entrevistas e
        LEFT JOIN usuarios u ON e.id_autor = u.id_usuario
        LEFT JOIN categorias c ON e.id_categoria = c.id_categoria
        WHERE e.activo = 1
        ORDER BY e.fecha_publicacion DESC
        LIMIT ?
      `, [limite]);
      return filas;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = EntrevistaModel;
