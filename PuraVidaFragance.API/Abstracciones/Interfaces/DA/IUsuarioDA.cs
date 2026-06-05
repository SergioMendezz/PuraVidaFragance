using Abstracciones.Modelos;

namespace Abstracciones.Interfaces.DA
{
    public interface IUsuarioDA
    {
        Task<UsuarioResponse?> ObtenerPorEmail(string email);
        Task ActualizarUltimoAcceso(Guid id);
        Task GuardarTokenRevocado(string token, Guid usuarioId, DateTime expira);
        Task<bool> TokenEstaRevocado(string token);
    }
}
