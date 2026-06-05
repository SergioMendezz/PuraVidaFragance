using Abstracciones.Modelos;

namespace Abstracciones.Interfaces.DA
{
    public interface IVarianteDA
    {
        Task<IEnumerable<VarianteResponse>> ObtenerPorPerfume(Guid IdPerfume);
        Task<Guid> Agregar(VarianteRequest variante);
        Task<Guid> Editar(Guid Id, VarianteRequest variante);
        Task<Guid> Eliminar(Guid Id);
    }
}
