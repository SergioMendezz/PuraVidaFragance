using Abstracciones.Modelos;

namespace Abstracciones.Interfaces.DA
{
    public interface IMarcaDA
    {
        Task<IEnumerable<MarcaResponse>> Obtener();
        Task<MarcaResponse> Obtener(Guid Id);
        Task<Guid> Agregar(MarcaRequest marca);
        Task<Guid> Editar(Guid Id, MarcaRequest marca);
        Task<Guid> Eliminar(Guid Id);
    }
}
