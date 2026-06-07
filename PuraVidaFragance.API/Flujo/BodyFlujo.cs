using Abstracciones.Interfaces.DA;
using Abstracciones.Interfaces.Flujo;
using Abstracciones.Modelos;

namespace Flujo
{
    public class BodyFlujo : IBodyFlujo
    {
        private readonly IBodyDA _bodyDA;

        public BodyFlujo(IBodyDA bodyDA)
        {
            _bodyDA = bodyDA;
        }

        public Task<IEnumerable<BodyResponse>> Obtener() => _bodyDA.Obtener();
        public Task<BodyResponse> Obtener(Guid Id) => _bodyDA.Obtener(Id);
        public Task<Guid> Agregar(BodyRequest body) => _bodyDA.Agregar(body);
        public Task<Guid> Editar(Guid Id, BodyRequest body) => _bodyDA.Editar(Id, body);
        public Task<Guid> Eliminar(Guid Id) => _bodyDA.Eliminar(Id);
    }
}