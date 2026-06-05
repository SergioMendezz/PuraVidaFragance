using System.ComponentModel.DataAnnotations;

namespace Abstracciones.Modelos
{
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
        public string Nombre { get; set; }
        public DateTime Expira { get; set; }
    }
}
