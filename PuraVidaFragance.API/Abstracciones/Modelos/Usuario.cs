using System.ComponentModel.DataAnnotations;

namespace Abstracciones.Modelos
{
    public class UsuarioResponse
    {
        public Guid Id { get; set; }
        public string NombreUsuario { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string PasswordSalt { get; set; }
        public string Rol { get; set; }
        public bool Activo { get; set; }
        public DateTime FechaCreacion { get; set; }
        public DateTime? UltimoAcceso { get; set; }
    }

    public class LoginRequest
    {
        [Required(ErrorMessage = "El email es requerido")]
        [EmailAddress(ErrorMessage = "El formato del email no es válido")]
        public string Email { get; set; }

        [Required(ErrorMessage = "La contraseña es requerida")]
        public string Password { get; set; }
    }

    public class LoginResponse
    {
        public string Token { get; set; }
        public string NombreUsuario { get; set; }
        public string Rol { get; set; }
        public DateTime Expira { get; set; }
    }
}