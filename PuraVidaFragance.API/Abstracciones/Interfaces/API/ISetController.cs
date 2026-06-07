using Abstracciones.Modelos;
using Microsoft.AspNetCore.Mvc;

namespace Abstracciones.Interfaces.API
{
    public interface ISetController
    {
        Task<IActionResult> Obtener();
        Task<IActionResult> Obtener(Guid Id);
        Task<IActionResult> Agregar(SetRequest set);
        Task<IActionResult> Editar(Guid Id, SetRequest set);
        Task<IActionResult> Eliminar(Guid Id);
    }
}