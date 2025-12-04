const sql = require('mssql');
const env = require('dotenv').config();

const dbconfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: false,
        trustservercertificate: true
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
}

let pool;

async function obtenerConexion() {

    try {
        if (pool) {
            return pool;
        }

        pool = await sql.connect (dbconfig);
        console.log("Conexion exitosa")
        return pool;
    } catch (error) {
        console.log("Error al conectarse a la base de datos")
        throw error;
    }
    
}

module.exports = {
    sql, obtenerConexion
}