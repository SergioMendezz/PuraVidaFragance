using Abstracciones.Modelos;

namespace Abstracciones.Interfaces.DA
{
    public interface IPerfumeDA
    {
        Task<IEnumerable<PerfumeResponse>> Obtener();
        Task<PerfumeResponse> Obtener(Guid Id);
        Task<Guid> Agregar(PerfumeRequest perfume);
        Task<Guid> Editar(Guid Id, PerfumeRequest perfume);
        Task<Guid> Eliminar(Guid Id);
    }
}