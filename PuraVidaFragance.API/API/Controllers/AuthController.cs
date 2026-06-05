using Abstracciones.Interfaces.API;
using Abstracciones.Interfaces.Flujo;
using Microsoft.AspNetCore.Authorization;
using Abstracciones.Modelos;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase, IAuthController
    {
        private readonly IAuthFlujo _authFlujo;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthFlujo authFlujo, ILogger<AuthController> logger)
        {
            _authFlujo = authFlujo;
            _logger = logger;
        }

        #region Operaciones

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                var resultado = await _authFlujo.Login(request);
                return Ok(resultado);
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized("Credenciales inválidas");
            }
        }

        [HttpPost("logout")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Logout()
        {
            try
            {
                var token = Request.Headers["Authorization"]
                    .ToString()
                    .Replace("Bearer ", "");

                await _authFlujo.Logout(token);
                return Ok("Sesión cerrada correctamente");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al cerrar sesión");
                return StatusCode(500, "Error al cerrar sesión");
            }
        }

        #endregion
    }
}