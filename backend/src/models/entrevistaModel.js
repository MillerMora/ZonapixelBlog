const db = require('../config/database');

const obtenerEntrevistas = async () => {
    try {
        const pool = await db.obtenerConexion();
        const resultado = await pool.request().query(`
            SELECT e.*, u.nombre_usuario, c.nombre_categoria
            FROM entrevistas e
            LEFT JOIN usuarios u ON e.id_autor = u.id_usuario
            LEFT JOIN categorias c ON e.id_categoria = c.id_categoria
            WHERE e.activo = 1
            ORDER BY e.fecha_publicacion DESC
        `);
        return resultado.recordset;
    } catch (error) {
        throw new Error('Error al obtener entrevistas: ' + error.message);
    }
};

const obtenerEntrevistaPorId = async (id) => {
    try {
        const pool = await db.obtenerConexion();
        const resultado = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT e.*, u.nombre_usuario, c.nombre_categoria
                FROM entrevistas e
                LEFT JOIN usuarios u ON e.id_autor = u.id_usuario
                LEFT JOIN categorias c ON e.id_categoria = c.id_categoria
                WHERE e.id_entrevista = @id AND e.activo = 1
            `);
        return resultado.recordset[0];
    } catch (error) {
        throw new Error('Error al obtener entrevista: ' + error.message);
    }
};

const obtenerEntrevistasPorAutor = async (idAutor) => {
    try {
        const pool = await db.obtenerConexion();
        const resultado = await pool.request()
            .input('id_autor', sql.Int, idAutor)
            .query(`
                SELECT e.*, u.nombre_usuario, c.nombre_categoria
                FROM entrevistas e
                LEFT JOIN usuarios u ON e.id_autor = u.id_usuario
                LEFT JOIN categorias c ON e.id_categoria = c.id_categoria
                WHERE e.id_autor = @id_autor AND e.activo = 1
                ORDER BY e.fecha_publicacion DESC
            `);
        return resultado.recordset;
    } catch (error) {
        throw new Error('Error al obtener entrevistas por autor: ' + error.message);
    }
};

module.exports = {
    obtenerEntrevistas,
    obtenerEntrevistaPorId,
    obtenerEntrevistasPorAutor
};
