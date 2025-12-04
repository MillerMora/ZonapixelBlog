const db = require('../config/database');

const obtenerComentarios = async () => {
    try {
        const pool = await db.obtenerConexion();
        const resultado = await pool.request().query(`
            SELECT c.*, u.nombre_usuario, o.titulo as titulo_opinion
            FROM comentarios c
            LEFT JOIN usuarios u ON c.id_autor = u.id_usuario
            LEFT JOIN opiniones o ON c.id_opinion = o.id_opinion
            WHERE c.activo = 1
            ORDER BY c.fecha_publicacion DESC
        `);
        return resultado.recordset;
    } catch (error) {
        throw new Error('Error al obtener comentarios: ' + error.message);
    }
};

const obtenerComentariosPorOpinion = async (idOpinion) => {
    try {
        const pool = await db.obtenerConexion();
        const resultado = await pool.request()
            .input('id_opinion', sql.Int, idOpinion)
            .query(`
                SELECT c.*, u.nombre_usuario
                FROM comentarios c
                LEFT JOIN usuarios u ON c.id_autor = u.id_usuario
                WHERE c.id_opinion = @id_opinion AND c.activo = 1
                ORDER BY c.fecha_publicacion DESC
            `);
        return resultado.recordset;
    } catch (error) {
        throw new Error('Error al obtener comentarios por opinión: ' + error.message);
    }
};

const obtenerComentarioPorId = async (id) => {
    try {
        const pool = await db.obtenerConexion();
        const resultado = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT c.*, u.nombre_usuario, o.titulo as titulo_opinion
                FROM comentarios c
                LEFT JOIN usuarios u ON c.id_autor = u.id_usuario
                LEFT JOIN opiniones o ON c.id_opinion = o.id_opinion
                WHERE c.id_comentario = @id AND c.activo = 1
            `);
        return resultado.recordset[0];
    } catch (error) {
        throw new Error('Error al obtener comentario: ' + error.message);
    }
};

module.exports = {
    obtenerComentarios,
    obtenerComentariosPorOpinion,
    obtenerComentarioPorId
};
