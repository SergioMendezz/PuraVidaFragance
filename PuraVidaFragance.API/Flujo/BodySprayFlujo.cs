using Abstracciones.Interfaces.DA;
using Abstracciones.Interfaces.Flujo;
using Abstracciones.Modelos;

namespace Flujo
{
    public class BodySprayFlujo : IBodySprayFlujo
    {
        private readonly IBodySprayDA _bodySprayDA;

        public BodySprayFlujo(IBodySprayDA bodySprayDA)
        {
            _bodySprayDA = bodySprayDA;
        }

        public Task<IEnumerable<BodySprayResponse>> Obtener() => _bodySprayDA.Obtener();
        public Task<BodySprayResponse> Obtener(Guid Id) => _bodySprayDA.Obtener(Id);
        public Task<Guid> Agregar(BodySprayRequest bodySpray) => _bodySprayDA.Agregar(bodySpray);
        public Task<Guid> Editar(Guid Id, BodySprayRequest bodySpray) => _bodySprayDA.Editar(Id, bodySpray);
        public Task<Guid> Eliminar(Guid Id) => _bodySprayDA.Eliminar(Id);
        public Task<Guid> Activar(Guid Id) => _bodySprayDA.Activar(Id);
    }
}