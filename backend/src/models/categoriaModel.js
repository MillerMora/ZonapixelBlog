const db = require('../config/database');

const obtenerCategorias = async () => {
    try {
        const pool = await db.obtenerConexion();
        const resultado = await pool.request().query(`
            SELECT * FROM categorias WHERE activo = 1 ORDER BY fecha_creacion DESC
        `);
        return resultado.recordset;
    } catch (error) {
        throw new Error('Error al obtener categorías: ' + error.message);
    }
};

const obtenerCategoriaPorId = async (id) => {
    try {
        const pool = await db.obtenerConexion();
        const resultado = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT * FROM categorias WHERE id_categoria = @id AND activo = 1
            `);
        return resultado.recordset[0];
    } catch (error) {
        throw new Error('Error al obtener categoría: ' + error.message);
    }
};

module.exports = {
    obtenerCategorias,
    obtenerCategoriaPorId
};
