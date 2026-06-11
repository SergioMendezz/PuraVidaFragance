using Abstracciones.Modelos;

namespace Abstracciones.Interfaces.DA
{
    public interface INotaDA
    {
        Task<IEnumerable<NotaResponse>> Obtener();
        Task<NotaResponse> Obtener(Guid Id);
        Task<Guid> Agregar(NotaRequest nota);
        Task<Guid> Editar(Guid Id, NotaRequest nota);
        Task<Guid> Eliminar(Guid Id);
        Task<Guid> Activar(Guid Id);
        Task<IEnumerable<NotaPerfumeResponse>> ObtenerPorPerfume(Guid IdPerfume);
        Task<Guid> AgregarAPerfume(NotaPerfumeRequest notaPerfume);
        Task<Guid> EliminarDePerfume(Guid IdPerfume, Guid IdNota);
    }
}