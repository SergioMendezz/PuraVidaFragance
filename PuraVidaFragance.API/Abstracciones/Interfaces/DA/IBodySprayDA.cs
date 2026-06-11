using Abstracciones.Modelos;

namespace Abstracciones.Interfaces.DA
{
    public interface IBodySprayDA
    {
        Task<IEnumerable<BodySprayResponse>> Obtener();
        Task<BodySprayResponse> Obtener(Guid Id);
        Task<Guid> Agregar(BodySprayRequest bodySpray);
        Task<Guid> Editar(Guid Id, BodySprayRequest bodySpray);
        Task<Guid> Eliminar(Guid Id);
        Task<Guid> Activar(Guid Id);
    }
}