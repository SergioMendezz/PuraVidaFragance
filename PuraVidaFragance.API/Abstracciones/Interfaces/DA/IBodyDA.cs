using Abstracciones.Modelos;

namespace Abstracciones.Interfaces.DA
{
    public interface IBodyDA
    {
        Task<IEnumerable<BodyResponse>> Obtener();
        Task<BodyResponse> Obtener(Guid Id);
        Task<Guid> Agregar(BodyRequest body);
        Task<Guid> Editar(Guid Id, BodyRequest body);
        Task<Guid> Eliminar(Guid Id);
    }
}