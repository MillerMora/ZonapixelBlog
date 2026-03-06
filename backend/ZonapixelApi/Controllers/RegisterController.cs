using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MySqlConnector;
using ZonapixelApi.Controllers.Models;
namespace ZonapixelApi.Controllers
{
    [Route("api/[controller]")]
    public class RegisterController : Controller
    {
        private readonly ILogger<RegisterController> _logger;

        public RegisterController(ILogger<RegisterController> logger)
        {
            _logger = logger;
        }

        [HttpPost]
        public JsonResult Register([FromBody] User request)
        {

            try
            {
                ConexionBd conexionBd = new ConexionBd();
                MySqlConnection conn = conexionBd.AbrirConexion();
                {
                    if (request.Password != request.ConfirmPassword)
                    {
                        return Json(new { success = false, message = "Contraseña no es correcta" });
                    }
                    string query = "INSERT INTO usuarios (nombre,apellido,nombre_usuario, email, password_hash, id_rol) VALUES (@Name, @LastName, @UserName, @Email, @Password, 2)";
                    MySqlCommand cmd = new MySqlCommand(query, conn);
                    cmd.Parameters.AddWithValue("@Name", request.Name);
                    cmd.Parameters.AddWithValue("@LastName", request.LastName);
                    cmd.Parameters.AddWithValue("@UserName", request.UserName);
                    cmd.Parameters.AddWithValue("@Email", request.Email);
                    cmd.Parameters.AddWithValue("@Password", request.Password);
                    int numero = cmd.ExecuteNonQuery();
                    if (numero > 0)
                    {
                        return Json(new
                        {
                            success = true,
                            message = "Registro completado"
                        });
                    }
                    else
                    {
                        return Json(new
                        {
                            success = false,
                            message = "Registro fallido"
                        });
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al registrarse");
                return Json(new { success = false, message = "Error en el servidor: " + ex.Message });
            }
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View("Error!");
        }
    }
}