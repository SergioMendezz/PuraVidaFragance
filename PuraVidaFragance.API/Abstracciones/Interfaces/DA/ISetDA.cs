using Abstracciones.Modelos;

namespace Abstracciones.Interfaces.DA
{
    public interface ISetDA
    {
        Task<IEnumerable<SetResponse>> Obtener();
        Task<SetResponse> Obtener(Guid Id);
        Task<Guid> Agregar(SetRequest set);
        Task<Guid> Editar(Guid Id, SetRequest set);
        Task<Guid> Eliminar(Guid Id);
    }
}