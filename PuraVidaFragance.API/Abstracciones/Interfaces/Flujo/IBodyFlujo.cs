using Abstracciones.Modelos;

namespace Abstracciones.Interfaces.Flujo
{
    public interface IBodyFlujo
    {
        Task<IEnumerable<BodyResponse>> Obtener();
        Task<BodyResponse> Obtener(Guid Id);
        Task<Guid> Agregar(BodyRequest body);
        Task<Guid> Editar(Guid Id, BodyRequest body);
        Task<Guid> Eliminar(Guid Id);
    }
}