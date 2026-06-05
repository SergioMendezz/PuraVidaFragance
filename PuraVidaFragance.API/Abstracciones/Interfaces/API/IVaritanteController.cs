using Abstracciones.Modelos;
using Microsoft.AspNetCore.Mvc;

namespace Abstracciones.Interfaces.API
{
    public interface IVarianteController
    {
        Task<IActionResult> ObtenerPorPerfume(Guid IdPerfume);
        Task<IActionResult> Agregar(VarianteRequest variante);
        Task<IActionResult> Editar(Guid Id, VarianteRequest variante);
        Task<IActionResult> Eliminar(Guid Id);
    }
}
