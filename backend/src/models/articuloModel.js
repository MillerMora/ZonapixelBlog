const { obtenerConexion, mysql } = require('../config/database');

class ArticuloModel {
  static async obtenerTodos() {
    try {
      const pool = await obtenerConexion();
      const [filas] = await pool.execute(`
        SELECT
          a.id_articulo,
          a.titulo,
          a.contenido,
          a.id_autor,
          a.id_categoria,
          a.id_juego,
          a.imagen_principal,
          a.fecha_publicacion,
          a.fecha_modificacion,
          a.vistas,
          a.activo,
          u.nombre_usuario,
          u.imagen_perfil,
          c.nombre_categoria,
          j.nombre_juego
        FROM articulos a
        LEFT JOIN usuarios u ON a.id_autor = u.id_usuario
        LEFT JOIN categorias c ON a.id_categoria = c.id_categoria
        LEFT JOIN juegos j ON a.id_juego = j.id_juego
        WHERE a.activo = 1
        ORDER BY a.fecha_publicacion DESC
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
          a.*,
          u.nombre_usuario,
          u.imagen_perfil,
          c.nombre_categoria,
          j.nombre_juego
        FROM articulos a
        LEFT JOIN usuarios u ON a.id_autor = u.id_usuario
        LEFT JOIN categorias c ON a.id_categoria = c.id_categoria
        LEFT JOIN juegos j ON a.id_juego = j.id_juego
        WHERE a.id_articulo = ? AND a.activo = 1
      `, [id]);
      return filas[0];
    } catch (error) {
      throw error;
    }
  }

  static async obtenerPorCategoria(idCategoria) {
    try {
      const pool = await obtenerConexion();
      const [filas] = await pool.execute(`
        SELECT
          a.*,
          u.nombre_usuario,
          c.nombre_categoria,
          j.nombre_juego
        FROM articulos a
        LEFT JOIN usuarios u ON a.id_autor = u.id_usuario
        LEFT JOIN categorias c ON a.id_categoria = c.id_categoria
        LEFT JOIN juegos j ON a.id_juego = j.id_juego
        WHERE a.id_categoria = ? AND a.activo = 1
        ORDER BY a.fecha_publicacion DESC
      `, [idCategoria]);
      return filas;
    } catch (error) {
      throw error;
    }
  }

  static async obtenerRecientes(limite = 5) {
    try {
      const pool = await obtenerConexion();
      const [filas] = await pool.execute(`
        SELECT
          a.*,
          u.nombre_usuario,
          c.nombre_categoria
        FROM articulos a
        LEFT JOIN usuarios u ON a.id_autor = u.id_usuario
        LEFT JOIN categorias c ON a.id_categoria = c.id_categoria
        WHERE a.activo = 1
        ORDER BY a.fecha_publicacion DESC
        LIMIT ?
      `, [limite]);
      return filas;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ArticuloModel;
