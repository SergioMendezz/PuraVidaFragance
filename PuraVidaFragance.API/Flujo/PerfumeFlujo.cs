using Abstracciones.Interfaces.DA;
using Abstracciones.Interfaces.Flujo;
using Abstracciones.Modelos;

namespace Flujo
{
    public class PerfumeFlujo : IPerfumeFlujo
    {
        private readonly IPerfumeDA _perfumeDA;

        public PerfumeFlujo(IPerfumeDA perfumeDA)
        {
            _perfumeDA = perfumeDA;
        }

        public Task<IEnumerable<PerfumeResponse>> Obtener() => _perfumeDA.Obtener();
        public Task<PerfumeResponse> Obtener(Guid Id) => _perfumeDA.Obtener(Id);
        public Task<Guid> Agregar(PerfumeRequest perfume) => _perfumeDA.Agregar(perfume);
        public Task<Guid> Editar(Guid Id, PerfumeRequest perfume) => _perfumeDA.Editar(Id, perfume);
        public Task<Guid> Eliminar(Guid Id) => _perfumeDA.Eliminar(Id);
        public Task<Guid> Activar(Guid Id) => _perfumeDA.Activar(Id);
    }
}
