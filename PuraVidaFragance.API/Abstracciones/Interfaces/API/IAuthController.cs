using Abstracciones.Modelos;
using Microsoft.AspNetCore.Mvc;

namespace Abstracciones.Interfaces.API
{
    public interface IAuthController
    {
        Task<IActionResult> Login(LoginRequest request);
        Task<IActionResult> Logout();
    }
}
