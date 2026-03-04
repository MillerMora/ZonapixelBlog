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
      return filas[0] || null;
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
      `, [parseInt(limite)]);
      return filas;
    } catch (error) {
      throw error;
    }
  }

  static async crear(resenaData) {
    const conexion = await obtenerConexion();
    const conn = await conexion.getConnection();
    
    try {
      await conn.beginTransaction();
      
      const { 
        nombre_juego, 
        plataforma, 
        calificacion_general,
        calificacion_grafica,
        calificacion_gameplay,
        calificacion_sonido,
        imagen_principal, 
        contenido, 
        fecha_publicacion,
        id_autor = 1 
      } = resenaData;

      // Validación de campos requeridos
      if (!nombre_juego || !contenido || !calificacion_general) {
        throw new Error('Faltan campos requeridos');
      }

      // Buscar o crear el juego
      const [juegoRows] = await conn.execute(
        'SELECT id_juego FROM juegos WHERE nombre_juego = ? AND activo = 1',
        [nombre_juego]
      );

      let id_juego;
      if (juegoRows.length === 0) {
        const [insertResult] = await conn.execute(
          'INSERT INTO juegos (nombre_juego, plataformas, activo) VALUES (?, ?, 1)',
          [nombre_juego, plataforma || 'Multiple']
        );
        id_juego = insertResult.insertId;
      } else {
        id_juego = juegoRows[0].id_juego;
      }

      // Insertar la reseña
      const [resultado] = await conn.execute(`
        INSERT INTO resenas (
          titulo, 
          contenido, 
          id_autor, 
          id_juego, 
          calificacion_grafica, 
          calificacion_gameplay, 
          calificacion_sonido, 
          calificacion_general, 
          imagen_principal, 
          fecha_publicacion, 
          activo
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
      `, [
        `Reseña de ${nombre_juego}`,
        contenido,
        id_autor,
        id_juego,
        calificacion_grafica || calificacion_general,
        calificacion_gameplay || calificacion_general,
        calificacion_sonido || calificacion_general,
        calificacion_general,
        imagen_principal || null,
        fecha_publicacion || new Date()
      ]);

      await conn.commit();
      return resultado.insertId;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  static async actualizar(id, resenaData) {
    const conexion = await obtenerConexion();
    const conn = await conexion.getConnection();
    
    try {
      await conn.beginTransaction();

      const { 
        nombre_juego, 
        plataforma, 
        calificacion_general,
        calificacion_grafica,
        calificacion_gameplay,
        calificacion_sonido,
        imagen_principal, 
        contenido, 
        fecha_publicacion 
      } = resenaData;

      // Validar que la reseña existe
      const [existeResena] = await conn.execute(
        'SELECT id_resena FROM resenas WHERE id_resena = ? AND activo = 1',
        [id]
      );

      if (existeResena.length === 0) {
        throw new Error('Reseña no encontrada');
      }

      // Buscar o crear el juego
      const [juegoRows] = await conn.execute(
        'SELECT id_juego FROM juegos WHERE nombre_juego = ? AND activo = 1',
        [nombre_juego]
      );

      let id_juego;
      if (juegoRows.length === 0) {
        const [insertResult] = await conn.execute(
          'INSERT INTO juegos (nombre_juego, plataformas, activo) VALUES (?, ?, 1)',
          [nombre_juego, plataforma || 'Multiple']
        );
        id_juego = insertResult.insertId;
      } else {
        id_juego = juegoRows[0].id_juego;
      }

      // Actualizar la reseña
      const [resultado] = await conn.execute(`
        UPDATE resenas
        SET 
          titulo = ?, 
          contenido = ?, 
          id_juego = ?, 
          calificacion_grafica = ?, 
          calificacion_gameplay = ?, 
          calificacion_sonido = ?, 
          calificacion_general = ?, 
          imagen_principal = ?, 
          fecha_publicacion = ?,
          fecha_modificacion = CURRENT_TIMESTAMP
        WHERE id_resena = ? AND activo = 1
      `, [
        `Reseña de ${nombre_juego}`,
        contenido,
        id_juego,
        calificacion_grafica || calificacion_general,
        calificacion_gameplay || calificacion_general,
        calificacion_sonido || calificacion_general,
        calificacion_general,
        imagen_principal || null,
        fecha_publicacion,
        id
      ]);

      await conn.commit();
      return resultado.affectedRows > 0;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  static async eliminar(id) {
    try {
      const pool = await obtenerConexion();
      const [resultado] = await pool.execute(`
        UPDATE resenas
        SET activo = 0, fecha_modificacion = CURRENT_TIMESTAMP
        WHERE id_resena = ?
      `, [id]);
      return resultado.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ResenaModel;