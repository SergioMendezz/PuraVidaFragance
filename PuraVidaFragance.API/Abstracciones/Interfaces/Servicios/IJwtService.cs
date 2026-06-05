using Abstracciones.Modelos;

namespace Abstracciones.Interfaces.Servicios
{
    public interface IJwtService
    {
        string GenerarToken(UsuarioResponse usuario);
        bool TokenEstaRevocado(string token);
    }
}
