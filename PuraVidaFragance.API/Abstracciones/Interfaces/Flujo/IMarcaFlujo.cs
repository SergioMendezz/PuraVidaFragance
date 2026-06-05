using Abstracciones.Modelos;

namespace Abstracciones.Interfaces.Flujo
{
    public interface IMarcaFlujo
    {
        Task<IEnumerable<MarcaResponse>> Obtener();
        Task<MarcaResponse> Obtener(Guid Id);
        Task<Guid> Agregar(MarcaRequest marca);
        Task<Guid> Editar(Guid Id, MarcaRequest marca);
        Task<Guid> Eliminar(Guid Id);
    }
}
