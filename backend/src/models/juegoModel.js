const db = require('../config/database');

const obtenerJuegos = async () => {
    try {
        const pool = await db.obtenerConexion();
        const resultado = await pool.request().query(`
            SELECT * FROM juegos WHERE activo = 1 ORDER BY fecha_creacion DESC
        `);
        return resultado.recordset;
    } catch (error) {
        throw new Error('Error al obtener juegos: ' + error.message);
    }
};

const obtenerJuegoPorId = async (id) => {
    try {
        const pool = await db.obtenerConexion();
        const resultado = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT * FROM juegos WHERE id_juego = @id AND activo = 1
            `);
        return resultado.recordset[0];
    } catch (error) {
        throw new Error('Error al obtener juego: ' + error.message);
    }
};

const crearJuego = async (juego) => {
    try {
        const pool = await db.obtenerConexion();
        const resultado = await pool.request()
            .input('nombre_juego', sql.VarChar, juego.nombre_juego)
            .input('descripcion', sql.NVarChar, juego.descripcion || null)
            .input('desarrollador', sql.VarChar, juego.desarrollador || null)
            .input('fecha_lanzamiento', sql.Date, juego.fecha_lanzamiento || null)
            .input('plataformas', sql.VarChar, juego.plataformas || null)
            .input('imagen_portada', sql.VarChar, juego.imagen_portada || null)
            .query(`
                INSERT INTO juegos (nombre_juego, descripcion, desarrollador, fecha_lanzamiento, plataformas, imagen_portada)
                OUTPUT INSERTED.*
                VALUES (@nombre_juego, @descripcion, @desarrollador, @fecha_lanzamiento, @plataformas, @imagen_portada)
            `);
        return resultado.recordset[0];
    } catch (error) {
        throw new Error('Error al crear juego: ' + error.message);
    }
};

const actualizarJuego = async (id, juego) => {
    try {
        const pool = await db.obtenerConexion();
        const resultado = await pool.request()
            .input('id', sql.Int, id)
            .input('nombre_juego', sql.VarChar, juego.nombre_juego)
            .input('descripcion', sql.NVarChar, juego.descripcion || null)
            .input('desarrollador', sql.VarChar, juego.desarrollador || null)
            .input('fecha_lanzamiento', sql.Date, juego.fecha_lanzamiento || null)
            .input('plataformas', sql.VarChar, juego.plataformas || null)
            .input('imagen_portada', sql.VarChar, juego.imagen_portada || null)
            .query(`
                UPDATE juegos
                SET nombre_juego = @nombre_juego, descripcion = @descripcion,
                    desarrollador = @desarrollador, fecha_lanzamiento = @fecha_lanzamiento,
                    plataformas = @plataformas, imagen_portada = @imagen_portada
                OUTPUT INSERTED.*
                WHERE id_juego = @id AND activo = 1
            `);
        return resultado.recordset[0];
    } catch (error) {
        throw new Error('Error al actualizar juego: ' + error.message);
    }
};

const eliminarJuego = async (id) => {
    try {
        const pool = await db.obtenerConexion();
        const resultado = await pool.request()
            .input('id', sql.Int, id)
            .query('UPDATE juegos SET activo = 0 WHERE id_juego = @id');
        return resultado.rowsAffected[0] > 0;
    } catch (error) {
        throw new Error('Error al eliminar juego: ' + error.message);
    }
};

module.exports = {
    obtenerJuegos,
    obtenerJuegoPorId,
    crearJuego,
    actualizarJuego,
    eliminarJuego
};
