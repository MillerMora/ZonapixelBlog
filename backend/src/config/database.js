const mysql = require('mysql2/promise');
require('dotenv').config();

const config = {
  host: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool = null;

const obtenerConexion = async () => {
  try {
    if (pool) {
      return pool;
    }
    pool = mysql.createPool(config);
    console.log('✓ Conexión a MySQL establecida');
    return pool;
  } catch (error) {
    console.error('Error al conectar con MySQL:', error);
    throw error;
  }
};

const cerrarConexion = async () => {
  try {
    if (pool) {
      await pool.end();
      pool = null;
      console.log('✓ Conexión a MySQL cerrada');
    }
  } catch (error) {
    console.error('Error al cerrar conexión:', error);
  }
};

module.exports = {
  mysql,
  obtenerConexion,
  cerrarConexion
};
