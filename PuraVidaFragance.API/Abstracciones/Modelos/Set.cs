using System.ComponentModel.DataAnnotations;

namespace Abstracciones.Modelos
{
    public class SetBase
    {
        [Required(ErrorMessage = "El nombre es requerido")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "El nombre debe tener entre 2 y 100 caracteres")]
        public string Nombre { get; set; }

        [Required(ErrorMessage = "El precio es requerido")]
        [Range(0, double.MaxValue, ErrorMessage = "El precio no puede ser negativo")]
        public decimal Precio { get; set; }

        public string? Descripcion { get; set; }
        public string? ImagenUrl { get; set; }
    }

    public class SetRequest : SetBase
    {
        public List<ItemSetRequest> Items { get; set; } = new();
    }

    public class SetResponse : SetBase
    {
        public Guid Id { get; set; }
        public List<ItemSetResponse> Items { get; set; } = new();
    }

    public class ItemSetRequest
    {
        [Required(ErrorMessage = "El tipo de producto es requerido")]
        [RegularExpression("^(Perfume|Body|BodySpray|Extra)$",
            ErrorMessage = "El tipo debe ser: Perfume, Body, BodySpray o Extra")]
        public string TipoProducto { get; set; }

        public Guid? IdProducto { get; set; }
        public string? NombreItem { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "La cantidad debe ser mayor a 0")]
        public int Cantidad { get; set; } = 1;

        public string? Descripcion { get; set; }
    }

    public class ItemSetResponse : ItemSetRequest
    {
        public Guid Id { get; set; }
        public Guid IdSet { get; set; }
    }
}