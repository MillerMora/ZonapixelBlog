using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MySqlConnector;
using ZonapixelApi.Controllers.Models;

namespace ZonapixelApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : Controller
    {
        private readonly ILogger<LoginController> _logger;

        public LoginController(ILogger<LoginController> logger)
        {
            _logger = logger;
        }

        
        [HttpPost]
        public IActionResult Login([FromBody] User request)
        {
            try
            {
                // Validar que los datos lleguen correctamente
                if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
                {
                    return Json(new { success = false, message = "Email y contraseña son requeridos" });
                }

                ConexionBd conexionbd = new ConexionBd();
                using (MySqlConnection conn = conexionbd.AbrirConexion())
                {
                    string query = "SELECT id_usuario, nombre_usuario, email, password_hash FROM usuarios WHERE email = @Email";
                    MySqlCommand cmd = new MySqlCommand(query, conn);
                    cmd.Parameters.AddWithValue("@Email", request.Email);

                    using (MySqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            int userId = reader.GetInt32(0);
                            string userName = reader.GetString(1);
                            string email = reader.GetString(2);
                            string storedPassword = reader.GetString(3);

                            // Comparar contraseña (texto plano)
                            if (storedPassword == request.Password)
                            {
                                return Json(new { 
                                    success = true, 
                                    message = "Login exitoso",
                                    user = new { id = userId, name = userName, email = email }
                                });
                            }
                            else
                            {
                                return Json(new { success = false, message = "Contraseña incorrecta" });
                            }
                        }
                    }
                }

                return Json(new { success = false, message = "Usuario no encontrado: " + request.Email });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error en el login");
                return Json(new { success = false, message = "Error en el servidor: " + ex.Message });
            }
        }
    }
}
