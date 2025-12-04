const db = require('../config/database');

const obtenerOpiniones = async () => {
    try {
        const pool = await db.obtenerConexion();
        const resultado = await pool.request().query(`
            SELECT o.*, u.nombre_usuario, c.nombre_categoria, j.nombre_juego
            FROM opiniones o
            LEFT JOIN usuarios u ON o.id_autor = u.id_usuario
            LEFT JOIN categorias c ON o.id_categoria = c.id_categoria
            LEFT JOIN juegos j ON o.id_juego = j.id_juego
            WHERE o.activo = 1
            ORDER BY o.fecha_publicacion DESC
        `);
        return resultado.recordset;
    } catch (error) {
        throw new Error('Error al obtener opiniones: ' + error.message);
    }
};

const obtenerOpinionPorId = async (id) => {
    try {
        const pool = await db.obtenerConexion();
        const resultado = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT o.*, u.nombre_usuario, c.nombre_categoria, j.nombre_juego
                FROM opiniones o
                LEFT JOIN usuarios u ON o.id_autor = u.id_usuario
                LEFT JOIN categorias c ON o.id_categoria = c.id_categoria
                LEFT JOIN juegos j ON o.id_juego = j.id_juego
                WHERE o.id_opinion = @id AND o.activo = 1
            `);
        return resultado.recordset[0];
    } catch (error) {
        throw new Error('Error al obtener opinión: ' + error.message);
    }
};

const obtenerOpinionesPorAutor = async (idAutor) => {
    try {
        const pool = await db.obtenerConexion();
        const resultado = await pool.request()
            .input('id_autor', sql.Int, idAutor)
            .query(`
                SELECT o.*, u.nombre_usuario, c.nombre_categoria, j.nombre_juego
                FROM opiniones o
                LEFT JOIN usuarios u ON o.id_autor = u.id_usuario
                LEFT JOIN categorias c ON o.id_categoria = c.id_categoria
                LEFT JOIN juegos j ON o.id_juego = j.id_juego
                WHERE o.id_autor = @id_autor AND o.activo = 1
                ORDER BY o.fecha_publicacion DESC
            `);
        return resultado.recordset;
    } catch (error) {
        throw new Error('Error al obtener opiniones por autor: ' + error.message);
    }
};

const obtenerOpinionesPorJuego = async (idJuego) => {
    try {
        const pool = await db.obtenerConexion();
        const resultado = await pool.request()
            .input('id_juego', sql.Int, idJuego)
            .query(`
                SELECT o.*, u.nombre_usuario, c.nombre_categoria, j.nombre_juego
                FROM opiniones o
                LEFT JOIN usuarios u ON o.id_autor = u.id_usuario
                LEFT JOIN categorias c ON o.id_categoria = c.id_categoria
                LEFT JOIN juegos j ON o.id_juego = j.id_juego
                WHERE o.id_juego = @id_juego AND o.activo = 1
                ORDER BY o.fecha_publicacion DESC
            `);
        return resultado.recordset;
    } catch (error) {
        throw new Error('Error al obtener opiniones por juego: ' + error.message);
    }
};

module.exports = {
    obtenerOpiniones,
    obtenerOpinionPorId,
    obtenerOpinionesPorAutor,
    obtenerOpinionesPorJuego
};
