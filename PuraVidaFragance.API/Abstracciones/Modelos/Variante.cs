using System.ComponentModel.DataAnnotations;

namespace Abstracciones.Modelos
{
        public class VarianteBase
        {
            [Required(ErrorMessage = "El tipo es requerido")]
            [RegularExpression("^(Completo|Decant)$", ErrorMessage = "El tipo debe ser: Completo o Decant")]
            public string Tipo { get; set; }

            [Required(ErrorMessage = "Los mililitros son requeridos")]
            [Range(0.1, 9999, ErrorMessage = "Los mililitros deben ser mayores a 0")]
            public decimal Mililitros { get; set; }

            [Required(ErrorMessage = "El precio es requerido")]
            [Range(0, double.MaxValue, ErrorMessage = "El precio no puede ser negativo")]
            public decimal Precio { get; set; }

            [Range(0, int.MaxValue, ErrorMessage = "El stock no puede ser negativo")]
            public int Stock { get; set; }
        }

        public class VarianteRequest : VarianteBase
        {
            [Required(ErrorMessage = "El IdPerfume es requerido")]
            public Guid IdPerfume { get; set; }
        }

        public class VarianteResponse : VarianteBase
        {
            public Guid Id { get; set; }
        }
    }
