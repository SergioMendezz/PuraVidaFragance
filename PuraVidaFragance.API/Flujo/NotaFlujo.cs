using Abstracciones.Interfaces.DA;
using Abstracciones.Interfaces.Flujo;
using Abstracciones.Modelos;

namespace Flujo
{
    public class NotaFlujo : INotaFlujo
    {
        private readonly INotaDA _notaDA;

        public NotaFlujo(INotaDA notaDA)
        {
            _notaDA = notaDA;
        }

        public Task<IEnumerable<NotaResponse>> Obtener() => _notaDA.Obtener();
        public Task<NotaResponse> Obtener(Guid Id) => _notaDA.Obtener(Id);
        public Task<Guid> Agregar(NotaRequest nota) => _notaDA.Agregar(nota);
        public Task<Guid> Editar(Guid Id, NotaRequest nota) => _notaDA.Editar(Id, nota);
        public Task<Guid> Eliminar(Guid Id) => _notaDA.Eliminar(Id);
        public Task<IEnumerable<NotaPerfumeResponse>> ObtenerPorPerfume(Guid IdPerfume) => _notaDA.ObtenerPorPerfume(IdPerfume);
        public Task<Guid> AgregarAPerfume(NotaPerfumeRequest request) => _notaDA.AgregarAPerfume(request);
        public Task<Guid> EliminarDePerfume(Guid IdPerfume, Guid IdNota) => _notaDA.EliminarDePerfume(IdPerfume, IdNota);
        public Task<Guid> Activar(Guid Id) => _notaDA.Activar(Id);
    }
}
