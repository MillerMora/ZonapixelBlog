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
      return filas[0] || null;
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
          u.imagen_perfil,
          c.nombre_categoria
        FROM entrevistas e
        LEFT JOIN usuarios u ON e.id_autor = u.id_usuario
        LEFT JOIN categorias c ON e.id_categoria = c.id_categoria
        WHERE e.activo = 1
        ORDER BY e.fecha_publicacion DESC
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
        entrevistado, 
        cargo_entrevistado, 
        video_url, 
        imagen_principal 
      } = data;

      // Validación de campos requeridos
      if (!titulo || !contenido || !entrevistado || !cargo_entrevistado) {
        throw new Error('Faltan campos requeridos');
      }

      const [resultado] = await pool.execute(`
        INSERT INTO entrevistas (
          titulo, 
          contenido, 
          id_autor, 
          id_categoria, 
          entrevistado, 
          cargo_entrevistado, 
          video_url, 
          imagen_principal,
          activo
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
      `, [
        titulo, 
        contenido, 
        idUsuario, 
        id_categoria || null, 
        entrevistado, 
        cargo_entrevistado, 
        video_url || null, 
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
        entrevistado, 
        cargo_entrevistado, 
        video_url, 
        imagen_principal 
      } = data;

      // Validación de campos requeridos
      if (!titulo || !contenido || !entrevistado || !cargo_entrevistado) {
        throw new Error('Faltan campos requeridos');
      }

      const [resultado] = await pool.execute(`
        UPDATE entrevistas
        SET 
          titulo = ?, 
          contenido = ?, 
          id_categoria = ?, 
          entrevistado = ?, 
          cargo_entrevistado = ?, 
          video_url = ?, 
          imagen_principal = ?, 
          fecha_modificacion = CURRENT_TIMESTAMP
        WHERE id_entrevista = ? AND id_autor = ? AND activo = 1
      `, [
        titulo, 
        contenido, 
        id_categoria || null, 
        entrevistado, 
        cargo_entrevistado, 
        video_url || null, 
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
        UPDATE entrevistas
        SET activo = 0, fecha_modificacion = CURRENT_TIMESTAMP
        WHERE id_entrevista = ? AND id_autor = ? AND activo = 1
      `, [id, idUsuario]);
      
      return resultado.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = EntrevistaModel;