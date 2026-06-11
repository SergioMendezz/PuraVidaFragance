using System.ComponentModel.DataAnnotations;

namespace Abstracciones.Modelos
{
    public class PerfumeBase
    {
        [Required(ErrorMessage = "El IdMarca es requerido")]
        public Guid IdMarca { get; set; }

        [Required(ErrorMessage = "El nombre es requerido")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "El nombre debe tener entre 2 y 100 caracteres")]
        public string Nombre { get; set; }

        [Required(ErrorMessage = "El género es requerido")]
        [RegularExpression("^(Hombre|Mujer|Unisex)$", ErrorMessage = "El género debe ser: Hombre, Mujer o Unisex")]
        public string Genero { get; set; }

        public string? Descripcion { get; set; }
        public string? ImagenUrl { get; set; }
    }

    public class PerfumeRequest : PerfumeBase { }

    public class PerfumeResponse : PerfumeBase
    {
        public Guid Id { get; set; }
        public string Marca { get; set; }
        public bool Activo { get; set; }
        public List<VarianteResponse> Variantes { get; set; } = new();
        public List<NotaPerfumeResponse> Notas { get; set; } = new();
    }
}