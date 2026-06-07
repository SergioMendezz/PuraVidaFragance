using Abstracciones.Modelos;
using Microsoft.AspNetCore.Mvc;

namespace Abstracciones.Interfaces.API
{
    public interface IBodySprayController
    {
        Task<IActionResult> Obtener();
        Task<IActionResult> Obtener(Guid Id);
        Task<IActionResult> Agregar(BodySprayRequest bodySpray);
        Task<IActionResult> Editar(Guid Id, BodySprayRequest bodySpray);
        Task<IActionResult> Eliminar(Guid Id);
    }
}