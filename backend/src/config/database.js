const sql = require('mssql');
const env = require('dotenv').config();

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_HOST,
    database: process.env.DB_NAME,
    options: {
        encrypt: true, 
        trustServerCertificate: true
    }
};

const poolPromise = new sql.ConnectionPool(dbConfig) .connect().then(pool => {
        console.log('Conexion exitosa a la base de datos');
        return pool;
    })
    .catch(err => console.log('Conexion fallida ', err));

    module.exports = { sql, poolPromise };