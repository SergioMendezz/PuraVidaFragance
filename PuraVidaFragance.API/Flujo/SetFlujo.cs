using Abstracciones.Interfaces.DA;
using Abstracciones.Interfaces.Flujo;
using Abstracciones.Modelos;

namespace Flujo
{
    public class SetFlujo : ISetFlujo
    {
        private readonly ISetDA _setDA;

        public SetFlujo(ISetDA setDA)
        {
            _setDA = setDA;
        }

        public Task<IEnumerable<SetResponse>> Obtener() => _setDA.Obtener();
        public Task<SetResponse> Obtener(Guid Id) => _setDA.Obtener(Id);
        public Task<Guid> Agregar(SetRequest set) => _setDA.Agregar(set);
        public Task<Guid> Editar(Guid Id, SetRequest set) => _setDA.Editar(Id, set);
        public Task<Guid> Eliminar(Guid Id) => _setDA.Eliminar(Id);
        public Task<Guid> Activar(Guid Id) => _setDA.Activar(Id);
    }
}