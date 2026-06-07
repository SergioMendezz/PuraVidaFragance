using Abstracciones.Modelos;

namespace Abstracciones.Interfaces.Flujo
{
    public interface IBodySprayFlujo
    {
        Task<IEnumerable<BodySprayResponse>> Obtener();
        Task<BodySprayResponse> Obtener(Guid Id);
        Task<Guid> Agregar(BodySprayRequest bodySpray);
        Task<Guid> Editar(Guid Id, BodySprayRequest bodySpray);
        Task<Guid> Eliminar(Guid Id);
    }
}