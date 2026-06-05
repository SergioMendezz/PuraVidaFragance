using Abstracciones.Interfaces.DA;
using Abstracciones.Interfaces.Flujo;
using Abstracciones.Modelos;

namespace Flujo
{
    public class VarianteFlujo : IVarianteFlujo
    {
        private readonly IVarianteDA _varianteDA;

        public VarianteFlujo(IVarianteDA varianteDA)
        {
            _varianteDA = varianteDA;
        }

        public Task<IEnumerable<VarianteResponse>> ObtenerPorPerfume(Guid IdPerfume) => _varianteDA.ObtenerPorPerfume(IdPerfume);
        public Task<Guid> Agregar(VarianteRequest variante) => _varianteDA.Agregar(variante);
        public Task<Guid> Editar(Guid Id, VarianteRequest variante) => _varianteDA.Editar(Id, variante);
        public Task<Guid> Eliminar(Guid Id) => _varianteDA.Eliminar(Id);
    }
}
