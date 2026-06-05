using Abstracciones.Interfaces.DA;
using Abstracciones.Interfaces.Flujo;
using Abstracciones.Interfaces.Servicios;
using Abstracciones.Modelos;
using BCrypt.Net;
using Microsoft.Extensions.Configuration;

namespace Flujo
{
    public class AuthFlujo : IAuthFlujo
    {
        private readonly IUsuarioDA _usuarioDA;
        private readonly IJwtService _jwtService;
        private readonly IConfiguration _configuracion;

        public AuthFlujo(IUsuarioDA usuarioDA, IJwtService jwtService, IConfiguration configuracion)
        {
            _usuarioDA = usuarioDA;
            _jwtService = jwtService;
            _configuracion = configuracion;
        }

        public async Task<LoginResponse> Login(LoginRequest request)
        {
            // 1. Buscar usuario por email
            var usuario = await _usuarioDA.ObtenerPorEmail(request.Email);
            if (usuario == null || !usuario.Activo)
                throw new UnauthorizedAccessException("Credenciales inválidas");

            // 2. Verificar password con BCrypt
            bool passwordValido = BCrypt.Net.BCrypt.Verify(request.Password, usuario.PasswordHash);
            if (!passwordValido)
                throw new UnauthorizedAccessException("Credenciales inválidas");

            // 3. Generar JWT
            var token = _jwtService.GenerarToken(usuario);
            var expira = DateTime.UtcNow.AddHours(
                double.Parse(_configuracion["Jwt:ExpiraHoras"] ?? "8"));

            // 4. Actualizar último acceso
            await _usuarioDA.ActualizarUltimoAcceso(usuario.Id);

            return new LoginResponse
            {
                Token = token,
                NombreUsuario = usuario.NombreUsuario,
                Rol = usuario.Rol,
                Expira = expira
            };
        }

        public async Task Logout(string token)
        {
            // Guardar el token en la lista negra hasta que expire
            var handler = new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token);
            var expira = jwtToken.ValidTo;

            // Obtener el Id del usuario desde el token
            var idClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "nameid")?.Value;
            var usuarioId = Guid.Parse(idClaim!);

            await _usuarioDA.GuardarTokenRevocado(token, usuarioId, expira);
        }
    }
}