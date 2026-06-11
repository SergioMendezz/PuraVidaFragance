using System.ComponentModel.DataAnnotations;

namespace Abstracciones.Modelos
{
    public class NotaBase
    {
        [Required(ErrorMessage = "El nombre es requerido")]
        [StringLength(50, MinimumLength = 2, ErrorMessage = "El nombre debe tener entre 2 y 50 caracteres")]
        public string Nombre { get; set; }

        [Required(ErrorMessage = "El color es requerido")]
        [RegularExpression(@"^#[0-9A-Fa-f]{6}$", ErrorMessage = "El color debe ser un hexadecimal válido")]
        public string ColorHex { get; set; }
    }

    public class NotaRequest : NotaBase { }

    public class NotaResponse : NotaBase
    {
        public Guid Id { get; set; }
        public bool Activo { get; set; }
    }

    public class NotaPerfumeResponse
    {
        public Guid IdNota { get; set; }
        public string Nombre { get; set; }
        public string ColorHex { get; set; }
        public int Intensidad { get; set; }
    }

    public class NotaPerfumeRequest
    {
        [Required(ErrorMessage = "El IdPerfume es requerido")]
        public Guid IdPerfume { get; set; }

        [Required(ErrorMessage = "El IdNota es requerido")]
        public Guid IdNota { get; set; }

        [Range(1, 10, ErrorMessage = "La intensidad debe estar entre 1 y 10")]
        public int Intensidad { get; set; }
    }
}