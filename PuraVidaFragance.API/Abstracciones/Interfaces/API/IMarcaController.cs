using Abstracciones.Modelos;
using Microsoft.AspNetCore.Mvc;

namespace Abstracciones.Interfaces.API
{
    public interface IMarcaController
    {
        Task<IActionResult> Obtener();
        Task<IActionResult> Obtener(Guid Id);
        Task<IActionResult> Agregar(MarcaRequest marca);
        Task<IActionResult> Editar(Guid Id, MarcaRequest marca);
        Task<IActionResult> Eliminar(Guid Id);
    }
}