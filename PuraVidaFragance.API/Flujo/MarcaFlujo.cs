using Abstracciones.Interfaces.DA;
using Abstracciones.Interfaces.Flujo;
using Abstracciones.Modelos;

namespace Flujo
{
    public class MarcaFlujo : IMarcaFlujo
    {
        private readonly IMarcaDA _marcaDA;

        public MarcaFlujo(IMarcaDA marcaDA)
        {
            _marcaDA = marcaDA;
        }

        public Task<IEnumerable<MarcaResponse>> Obtener() => _marcaDA.Obtener();
        public Task<MarcaResponse> Obtener(Guid Id) => _marcaDA.Obtener(Id);
        public Task<Guid> Agregar(MarcaRequest marca) => _marcaDA.Agregar(marca);
        public Task<Guid> Editar(Guid Id, MarcaRequest marca) => _marcaDA.Editar(Id, marca);
        public Task<Guid> Eliminar(Guid Id) => _marcaDA.Eliminar(Id);
    }
}
