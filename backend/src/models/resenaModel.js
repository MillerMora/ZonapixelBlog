const db = require('../config/database');
const obtenerResenas = async () => {
    try {
        const pool = await db.obtenerConexion();
        const resultado = await pool.request().query(`
            SELECT r.*, u.nombre_usuario, c.nombre_categoria, j.nombre_juego
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
                SELECT r.*, u.nombre_usuario, c.nombre_categoria, j.nombre_juego
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

const obtenerResenasPorAutor = async (idAutor) => {
    try {
        const pool = await db.obtenerConexion();
        const resultado = await pool.request()
            .input('id_autor', sql.Int, idAutor)
            .query(`
                SELECT r.*, u.nombre_usuario, c.nombre_categoria, j.nombre_juego
                FROM resenas r
                LEFT JOIN usuarios u ON r.id_autor = u.id_usuario
                LEFT JOIN categorias c ON r.id_categoria = c.id_categoria
                LEFT JOIN juegos j ON r.id_juego = j.id_juego
                WHERE r.id_autor = @id_autor AND r.activo = 1
                ORDER BY r.fecha_publicacion DESC
            `);
        return resultado.recordset;
    } catch (error) {
        throw new Error('Error al obtener reseñas por autor: ' + error.message);
    }
};

const obtenerResenasPorJuego = async (idJuego) => {
    try {
        const pool = await db.obtenerConexion();
        const resultado = await pool.request()
            .input('id_juego', sql.Int, idJuego)
            .query(`
                SELECT r.*, u.nombre_usuario, c.nombre_categoria, j.nombre_juego
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

module.exports = {
    obtenerResenas,
    obtenerResenaPorId,
    obtenerResenasPorAutor,
    obtenerResenasPorJuego
};
