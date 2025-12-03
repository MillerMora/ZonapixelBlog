const db = require('../config/database');
const sql = require('mssql');

const obtenerCalificaciones = async () => {
    try {
        const pool = await db.obtenerConexion();
        const resultado = await pool.request().query(`
            SELECT co.*, u.nombre_usuario, o.titulo as titulo_opinion
            FROM calificaciones_opiniones co
            LEFT JOIN usuarios u ON co.id_usuario = u.id_usuario
            LEFT JOIN opiniones o ON co.id_opinion = o.id_opinion
            ORDER BY co.fecha_calificacion DESC
        `);
        return resultado.recordset;
    } catch (error) {
        throw new Error('Error al obtener calificaciones: ' + error.message);
    }
};

const obtenerCalificacionesPorOpinion = async (idOpinion) => {
    try {
        const pool = await db.obtenerConexion();
        const resultado = await pool.request()
            .input('id_opinion', sql.Int, idOpinion)
            .query(`
                SELECT co.*, u.nombre_usuario
                FROM calificaciones_opiniones co
                LEFT JOIN usuarios u ON co.id_usuario = u.id_usuario
                WHERE co.id_opinion = @id_opinion
                ORDER BY co.fecha_calificacion DESC
            `);
        return resultado.recordset;
    } catch (error) {
        throw new Error('Error al obtener calificaciones por opinión: ' + error.message);
    }
};

const obtenerCalificacionUsuario = async (idOpinion, idUsuario) => {
    try {
        const pool = await db.obtenerConexion();
        const resultado = await pool.request()
            .input('id_opinion', sql.Int, idOpinion)
            .input('id_usuario', sql.Int, idUsuario)
            .query(`
                SELECT * FROM calificaciones_opiniones
                WHERE id_opinion = @id_opinion AND id_usuario = @id_usuario
            `);
        return resultado.recordset[0];
    } catch (error) {
        throw new Error('Error al obtener calificación del usuario: ' + error.message);
    }
};

const crearCalificacion = async (calificacion) => {
    try {
        const pool = await db.obtenerConexion();
        const resultado = await pool.request()
            .input('id_opinion', sql.Int, calificacion.id_opinion)
            .input('id_usuario', sql.Int, calificacion.id_usuario)
            .input('calificacion', sql.Int, calificacion.calificacion)
            .query(`
                INSERT INTO calificaciones_opiniones (id_opinion, id_usuario, calificacion)
                OUTPUT INSERTED.*
                VALUES (@id_opinion, @id_usuario, @calificacion)
            `);
        return resultado.recordset[0];
    } catch (error) {
        throw new Error('Error al crear calificación: ' + error.message);
    }
};

const actualizarCalificacion = async (idOpinion, idUsuario, calificacion) => {
    try {
        const pool = await db.obtenerConexion();
        const resultado = await pool.request()
            .input('id_opinion', sql.Int, idOpinion)
            .input('id_usuario', sql.Int, idUsuario)
            .input('calificacion', sql.Int, calificacion)
            .query(`
                UPDATE calificaciones_opiniones
                SET calificacion = @calificacion, fecha_calificacion = GETDATE()
                OUTPUT INSERTED.*
                WHERE id_opinion = @id_opinion AND id_usuario = @id_usuario
            `);
        return resultado.recordset[0];
    } catch (error) {
        throw new Error('Error al actualizar calificación: ' + error.message);
    }
};

const eliminarCalificacion = async (idOpinion, idUsuario) => {
    try {
        const pool = await db.obtenerConexion();
        const resultado = await pool.request()
            .input('id_opinion', sql.Int, idOpinion)
            .input('id_usuario', sql.Int, idUsuario)
            .query('DELETE FROM calificaciones_opiniones WHERE id_opinion = @id_opinion AND id_usuario = @id_usuario');
        return resultado.rowsAffected[0] > 0;
    } catch (error) {
        throw new Error('Error al eliminar calificación: ' + error.message);
    }
};

module.exports = {
    obtenerCalificaciones,
    obtenerCalificacionesPorOpinion,
    obtenerCalificacionUsuario,
    crearCalificacion,
    actualizarCalificacion,
    eliminarCalificacion
};
