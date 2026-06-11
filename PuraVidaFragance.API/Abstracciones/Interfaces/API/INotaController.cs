using Abstracciones.Modelos;
using Microsoft.AspNetCore.Mvc;

namespace Abstracciones.Interfaces.API
{
    public interface INotaController
    {
        Task<IActionResult> Obtener();
        Task<IActionResult> Obtener(Guid Id);
        Task<IActionResult> Agregar(NotaRequest nota);
        Task<IActionResult> Editar(Guid Id, NotaRequest nota);
        Task<IActionResult> Eliminar(Guid Id);
        Task<IActionResult> Activar(Guid Id);
        Task<IActionResult> ObtenerPorPerfume(Guid IdPerfume);
        Task<IActionResult> AgregarAPerfume(NotaPerfumeRequest notaPerfume);
        Task<IActionResult> EliminarDePerfume(Guid IdPerfume, Guid IdNota);
    }
}