using Abstracciones.Modelos;
using Microsoft.AspNetCore.Mvc;

namespace Abstracciones.Interfaces.API
{
    public interface IPerfumeController
    {
        Task<IActionResult> Obtener();
        Task<IActionResult> Obtener(Guid Id);
        Task<IActionResult> Agregar(PerfumeRequest perfume);
        Task<IActionResult> Editar(Guid Id, PerfumeRequest perfume);
        Task<IActionResult> Eliminar(Guid Id);
        Task<IActionResult> Activar(Guid Id);
    }
}