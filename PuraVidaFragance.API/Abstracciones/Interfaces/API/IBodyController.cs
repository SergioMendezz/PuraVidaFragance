using Abstracciones.Modelos;
using Microsoft.AspNetCore.Mvc;

namespace Abstracciones.Interfaces.API
{
    public interface IBodyController
    {
        Task<IActionResult> Obtener();
        Task<IActionResult> Obtener(Guid Id);
        Task<IActionResult> Agregar(BodyRequest body);
        Task<IActionResult> Editar(Guid Id, BodyRequest body);
        Task<IActionResult> Eliminar(Guid Id);
        Task<IActionResult> Activar(Guid Id);
    }
}