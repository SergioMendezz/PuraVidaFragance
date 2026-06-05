using Abstracciones.Modelos;

namespace Abstracciones.Interfaces.Flujo
{
    public interface IAuthFlujo
    {
        Task<LoginResponse> Login(LoginRequest request);
        Task Logout(string token);
    }
}