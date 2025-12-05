const { obtenerConexion, mysql } = require('../config/database');

class CategoriaModel {
  static async obtenerTodos() {
    try {
      const pool = await obtenerConexion();
      const [filas] = await pool.execute(`
        SELECT
          id_categoria,
          nombre_categoria,
          descripcion,
          imagen_categoria,
          fecha_creacion,
          activo
        FROM categorias
        WHERE activo = 1
        ORDER BY nombre_categoria ASC
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
        SELECT * FROM categorias
        WHERE id_categoria = ? AND activo = 1
      `, [id]);
      return filas[0];
    } catch (error) {
      throw error;
    }
  }

  static async obtenerConConteo() {
    try {
      const pool = await obtenerConexion();
      const [filas] = await pool.execute(`
        SELECT
          c.*,
          COUNT(DISTINCT a.id_articulo) as total_articulos,
          COUNT(DISTINCT r.id_resena) as total_resenas,
          COUNT(DISTINCT o.id_opinion) as total_opiniones
        FROM categorias c
        LEFT JOIN articulos a ON c.id_categoria = a.id_categoria AND a.activo = 1
        LEFT JOIN resenas r ON c.id_categoria = r.id_categoria AND r.activo = 1
        LEFT JOIN opiniones o ON c.id_categoria = o.id_categoria AND o.activo = 1
        WHERE c.activo = 1
        GROUP BY
          c.id_categoria, c.nombre_categoria, c.descripcion,
          c.imagen_categoria, c.fecha_creacion, c.activo
        ORDER BY c.nombre_categoria ASC
      `);
      return filas;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CategoriaModel;
