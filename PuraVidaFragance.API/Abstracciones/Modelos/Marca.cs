using System.ComponentModel.DataAnnotations;

namespace Abstracciones.Modelos
{
    public class MarcaBase
    {
        [Required(ErrorMessage = "El nombre es requerido")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "El nombre debe tener entre 2 y 100 caracteres")]
        public string Nombre { get; set; }

        public string? PaisOrigen { get; set; }
        public string? Descripcion { get; set; }
        public string? LogoUrl { get; set; }
    }

    public class MarcaRequest : MarcaBase { }

    public class MarcaResponse : MarcaBase
    {
        public Guid Id { get; set; }
        public bool Activo { get; set; }

    }
}

