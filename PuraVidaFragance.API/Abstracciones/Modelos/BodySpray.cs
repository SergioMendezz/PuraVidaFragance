using System.ComponentModel.DataAnnotations;

namespace Abstracciones.Modelos
{
    public class BodySprayBase
    {
        [Required(ErrorMessage = "El nombre es requerido")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "El nombre debe tener entre 2 y 100 caracteres")]
        public string Nombre { get; set; }

        public Guid? IdPerfumeBase { get; set; }
        public Guid? IdMarca { get; set; }

        [Required(ErrorMessage = "Los mililitros son requeridos")]
        [Range(0.1, 9999, ErrorMessage = "Los mililitros deben ser mayores a 0")]
        public decimal Mililitros { get; set; }

        [Required(ErrorMessage = "El precio es requerido")]
        [Range(0, double.MaxValue, ErrorMessage = "El precio no puede ser negativo")]
        public decimal Precio { get; set; }

        public string? Descripcion { get; set; }
        public string? ImagenUrl { get; set; }
    }

    public class BodySprayRequest : BodySprayBase { }

    public class BodySprayResponse : BodySprayBase
    {
        public Guid Id { get; set; }
        public string? Marca { get; set; }
        public string? NombrePerfumeBase { get; set; }
    }
}