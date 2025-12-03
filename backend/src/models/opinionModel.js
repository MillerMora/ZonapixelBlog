const db = require('../config/database');
const sql = require('mssql');

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

const crearOpinion = async (opinion) => {
    try {
        const pool = await db.obtenerConexion();
        const resultado = await pool.request()
            .input('titulo', sql.VarChar, opinion.titulo)
            .input('contenido', sql.NVarChar, opinion.contenido)
            .input('id_autor', sql.Int, opinion.id_autor)
            .input('id_categoria', sql.Int, opinion.id_categoria || null)
            .input('id_juego', sql.Int, opinion.id_juego || null)
            .input('calificacion_estrellas', sql.Int, opinion.calificacion_estrellas)
            .input('imagen_principal', sql.VarChar, opinion.imagen_principal || null)
            .query(`
                INSERT INTO opiniones (titulo, contenido, id_autor, id_categoria, id_juego,
                                     calificacion_estrellas, imagen_principal)
                OUTPUT INSERTED.*
                VALUES (@titulo, @contenido, @id_autor, @id_categoria, @id_juego,
                        @calificacion_estrellas, @imagen_principal)
            `);
        return resultado.recordset[0];
    } catch (error) {
        throw new Error('Error al crear opinión: ' + error.message);
    }
};

const actualizarOpinion = async (id, opinion) => {
    try {
        const pool = await db.obtenerConexion();
        const resultado = await pool.request()
            .input('id', sql.Int, id)
            .input('titulo', sql.VarChar, opinion.titulo)
            .input('contenido', sql.NVarChar, opinion.contenido)
            .input('id_categoria', sql.Int, opinion.id_categoria || null)
            .input('id_juego', sql.Int, opinion.id_juego || null)
            .input('calificacion_estrellas', sql.Int, opinion.calificacion_estrellas)
            .input('imagen_principal', sql.VarChar, opinion.imagen_principal || null)
            .query(`
                UPDATE opiniones
                SET titulo = @titulo, contenido = @contenido, id_categoria = @id_categoria,
                    id_juego = @id_juego, calificacion_estrellas = @calificacion_estrellas,
                    imagen_principal = @imagen_principal
                OUTPUT INSERTED.*
                WHERE id_opinion = @id AND activo = 1
            `);
        return resultado.recordset[0];
    } catch (error) {
        throw new Error('Error al actualizar opinión: ' + error.message);
    }
};

const incrementarVistasOpinion = async (id) => {
    try {
        const pool = await db.obtenerConexion();
        await pool.request()
            .input('id', sql.Int, id)
            .query('UPDATE opiniones SET vistas = vistas + 1 WHERE id_opinion = @id');
    } catch (error) {
        throw new Error('Error al incrementar vistas de la opinión: ' + error.message);
    }
};

const eliminarOpinion = async (id) => {
    try {
        const pool = await db.obtenerConexion();
        const resultado = await pool.request()
            .input('id', sql.Int, id)
            .query('UPDATE opiniones SET activo = 0 WHERE id_opinion = @id');
        return resultado.rowsAffected[0] > 0;
    } catch (error) {
        throw new Error('Error al eliminar opinión: ' + error.message);
    }
};

module.exports = {
    obtenerOpiniones,
    obtenerOpinionPorId,
    obtenerOpinionesPorAutor,
    obtenerOpinionesPorJuego,
    crearOpinion,
    actualizarOpinion,
    incrementarVistasOpinion,
    eliminarOpinion
};
