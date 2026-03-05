using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MySqlConnector;

namespace ZonapixelApi
{
    public class ConexionBd
    {
        private readonly string _connectionString;

        public ConexionBd()
        {
            _connectionString = "Server=localhost;Port=3306;Database=zonapixel_db;User=root;Password=;";
        }

        public MySqlConnection CrearConexion()
        {
            return new MySqlConnection(_connectionString);
        }

        public MySqlConnection AbrirConexion()
        {
            MySqlConnection conn = CrearConexion();
            conn.Open();
            return conn;
        }

        public void CerrarConexion(MySqlConnection conn)
        {
            if (conn != null && conn.State == System.Data.ConnectionState.Open)
            {
                conn.Close();
                conn.Dispose();
            }
        }

        public int EjecutarConsulta(string consulta)
        {
            MySqlConnection conn = null;
            try
            {
                conn = AbrirConexion();
                MySqlCommand cmd = new MySqlCommand(consulta, conn);
                return cmd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al ejecutar consulta: {ex.Message}");
                throw;
            }
            finally
            {
                CerrarConexion(conn);
            }
        }

        public MySqlDataReader EjecutarConsultaSelect(string consulta)
        {
            MySqlConnection conn = AbrirConexion();
            MySqlCommand cmd = new MySqlCommand(consulta, conn);
            return cmd.ExecuteReader();
        }

        public object EjecutarScalar(string consulta)
        {
            MySqlConnection conn = null;
            try
            {
                conn = AbrirConexion();
                MySqlCommand cmd = new MySqlCommand(consulta, conn);
                return cmd.ExecuteScalar();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al ejecutar scalar: {ex.Message}");
                throw;
            }
            finally
            {
                CerrarConexion(conn);
            }
        }

        public bool ProbarConexion()
        {
            try
            {
                using (MySqlConnection conn = AbrirConexion())
                {
                    return true;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error de conexión: {ex.Message}");
                return false;
            }
        }
    }
}

