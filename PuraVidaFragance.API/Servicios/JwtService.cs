using Abstracciones.Interfaces.Servicios;
using Abstracciones.Modelos;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Servicios
{
    public class JwtService : IJwtService
    {
        private readonly IConfiguration _configuracion;

        public JwtService(IConfiguration configuracion)
        {
            _configuracion = configuracion;
        }

        public string GenerarToken(UsuarioResponse usuario)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuracion["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
                new Claim(ClaimTypes.Email,          usuario.Email),
                new Claim(ClaimTypes.Name,           usuario.NombreUsuario),
                new Claim(ClaimTypes.Role,           usuario.Rol)
            };

            var expira = DateTime.UtcNow.AddHours(
                double.Parse(_configuracion["Jwt:ExpiraHoras"] ?? "8"));

            var token = new JwtSecurityToken(
                issuer: _configuracion["Jwt:Issuer"],
                audience: _configuracion["Jwt:Audience"],
                claims: claims,
                expires: expira,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public bool TokenEstaRevocado(string token)
        {
            // La verificación real se hace en el DA consultando TokensRevocados
            // Este método existe para que el middleware lo pueda llamar
            return false;
        }
    }
}