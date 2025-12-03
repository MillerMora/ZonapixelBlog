const db = require('../config/database');
const sql = require('mssql');

const obtenerResenas = async () => {
    try {
        const pool = await db.obtenerConexion();
        const resultado = await pool.request().query(`
            SELECT r.*, u.nombre_usuario, c.nombre_categoria, j.nombre_juego, j.desarrollador
            FROM resenas r
            LEFT JOIN usuarios u ON r.id_autor = u.id_usuario
            LEFT JOIN categorias c ON r.id_categoria = c.id_categoria
            LEFT JOIN juegos j ON r.id_juego = j.id_juego
            WHERE r.activo = 1
            ORDER BY r.fecha_publicacion DESC
        `);
        return resultado.recordset;
    } catch (error) {
        throw new Error('Error al obtener reseñas: ' + error.message);
    }
};

const obtenerResenaPorId = async (id) => {
    try {
        const pool = await db.obtenerConexion();
        const resultado = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT r.*, u.nombre_usuario, c.nombre_categoria, j.nombre_juego, j.desarrollador
                FROM resenas r
                LEFT JOIN usuarios u ON r.id_autor = u.id_usuario
                LEFT JOIN categorias c ON r.id_categoria = c.id_categoria
                LEFT JOIN juegos j ON r.id_juego = j.id_juego
                WHERE r.id_resena = @id AND r.activo = 1
            `);
        return resultado.recordset[0];
    } catch (error) {
        throw new Error('Error al obtener reseña: ' + error.message);
    }
};

const obtenerResenasPorJuego = async (idJuego) => {
    try {
        const pool = await db.obtenerConexion();
        const resultado = await pool.request()
            .input('id_juego', sql.Int, idJuego)
            .query(`
                SELECT r.*, u.nombre_usuario, c.nombre_categoria, j.nombre_juego, j.desarrollador
                FROM resenas r
                LEFT JOIN usuarios u ON r.id_autor = u.id_usuario
                LEFT JOIN categorias c ON r.id_categoria = c.id_categoria
                LEFT JOIN juegos j ON r.id_juego = j.id_juego
                WHERE r.id_juego = @id_juego AND r.activo = 1
                ORDER BY r.fecha_publicacion DESC
            `);
        return resultado.recordset;
    } catch (error) {
        throw new Error('Error al obtener reseñas por juego: ' + error.message);
    }
};

const crearResena = async (resena) => {
    try {
        const pool = await db.obtenerConexion();
        const resultado = await pool.request()
            .input('titulo', sql.VarChar, resena.titulo)
            .input('contenido', sql.NVarChar, resena.contenido)
            .input('id_autor', sql.Int, resena.id_autor)
            .input('id_categoria', sql.Int, resena.id_categoria || null)
            .input('id_juego', sql.Int, resena.id_juego)
            .input('calificacion_grafica', sql.Decimal(3,1), resena.calificacion_grafica)
            .input('calificacion_gameplay', sql.Decimal(3,1), resena.calificacion_gameplay)
            .input('calificacion_sonido', sql.Decimal(3,1), resena.calificacion_sonido)
            .input('calificacion_general', sql.Decimal(3,1), resena.calificacion_general)
            .input('imagen_principal', sql.VarChar, resena.imagen_principal || null)
            .query(`
                INSERT INTO resenas (titulo, contenido, id_autor, id_categoria, id_juego,
                                   calificacion_grafica, calificacion_gameplay, calificacion_sonido,
                                   calificacion_general, imagen_principal)
                OUTPUT INSERTED.*
                VALUES (@titulo, @contenido, @id_autor, @id_categoria, @id_juego,
                        @calificacion_grafica, @calificacion_gameplay, @calificacion_sonido,
                        @calificacion_general, @imagen_principal)
            `);
        return resultado.recordset[0];
    } catch (error) {
        throw new Error('Error al crear reseña: ' + error.message);
    }
};

const actualizarResena = async (id, resena) => {
    try {
        const pool = await db.obtenerConexion();
        const resultado = await pool.request()
            .input('id', sql.Int, id)
            .input('titulo', sql.VarChar, resena.titulo)
            .input('contenido', sql.NVarChar, resena.contenido)
            .input('id_categoria', sql.Int, resena.id_categoria || null)
            .input('calificacion_grafica', sql.Decimal(3,1), resena.calificacion_grafica)
            .input('calificacion_gameplay', sql.Decimal(3,1), resena.calificacion_gameplay)
            .input('calificacion_sonido', sql.Decimal(3,1), resena.calificacion_sonido)
            .input('calificacion_general', sql.Decimal(3,1), resena.calificacion_general)
            .input('imagen_principal', sql.VarChar, resena.imagen_principal || null)
            .query(`
                UPDATE resenas
                SET titulo = @titulo, contenido = @contenido, id_categoria = @id_categoria,
                    calificacion_grafica = @calificacion_grafica, calificacion_gameplay = @calificacion_gameplay,
                    calificacion_sonido = @calificacion_sonido, calificacion_general = @calificacion_general,
                    imagen_principal = @imagen_principal
                OUTPUT INSERTED.*
                WHERE id_resena = @id AND activo = 1
            `);
        return resultado.recordset[0];
    } catch (error) {
        throw new Error('Error al actualizar reseña: ' + error.message);
    }
};

const incrementarVistasResena = async (id) => {
    try {
        const pool = await db.obtenerConexion();
        await pool.request()
            .input('id', sql.Int, id)
            .query('UPDATE resenas SET vistas = vistas + 1 WHERE id_resena = @id');
    } catch (error) {
        throw new Error('Error al incrementar vistas de la reseña: ' + error.message);
    }
};

const eliminarResena = async (id) => {
    try {
        const pool = await db.obtenerConexion();
        const resultado = await pool.request()
            .input('id', sql.Int, id)
            .query('UPDATE resenas SET activo = 0 WHERE id_resena = @id');
        return resultado.rowsAffected[0] > 0;
    } catch (error) {
        throw new Error('Error al eliminar reseña: ' + error.message);
    }
};

module.exports = {
    obtenerResenas,
    obtenerResenaPorId,
    obtenerResenasPorJuego,
    crearResena,
    actualizarResena,
    incrementarVistasResena,
    eliminarResena
};
