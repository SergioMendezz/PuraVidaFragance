using Abstracciones.Interfaces.API;
using Abstracciones.Interfaces.Flujo;
using Abstracciones.Modelos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotaController : ControllerBase, INotaController
    {
        private readonly INotaFlujo _notaFlujo;
        private readonly ILogger<NotaController> _logger;

        public NotaController(INotaFlujo notaFlujo, ILogger<NotaController> logger)
        {
            _notaFlujo = notaFlujo;
            _logger = logger;
        }

        #region Catálogo de notas

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> Obtener()
        {
            var resultado = await _notaFlujo.Obtener();
            if (!resultado.Any())
                return NoContent();
            return Ok(resultado);
        }

        [HttpGet("{Id}")]
        [AllowAnonymous]
        public async Task<IActionResult> Obtener([FromRoute] Guid Id)
        {
            var resultado = await _notaFlujo.Obtener(Id);
            if (resultado == null)
                return NotFound("No se encontró la nota");
            return Ok(resultado);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Agregar([FromBody] NotaRequest nota)
        {
            var resultado = await _notaFlujo.Agregar(nota);
            return CreatedAtAction(nameof(Obtener), new { Id = resultado }, null);
        }

        [HttpPut("{Id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Editar([FromRoute] Guid Id, [FromBody] NotaRequest nota)
        {
            if (!await VerificarExiste(Id))
                return NotFound("No se encontró la nota");
            var resultado = await _notaFlujo.Editar(Id, nota);
            return Ok(resultado);
        }

        [HttpDelete("{Id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Eliminar([FromRoute] Guid Id)
        {
            if (!await VerificarExiste(Id))
                return NotFound("No se encontró la nota");
            await _notaFlujo.Eliminar(Id);
            return NoContent();
        }

        [HttpPatch("{Id}/activar")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Activar([FromRoute] Guid Id)
        {
            var resultado = await _notaFlujo.Activar(Id);
            return Ok(resultado);
        }

        #endregion

        #region Notas de un perfume

        [HttpGet("perfume/{IdPerfume}")]
        [AllowAnonymous]
        public async Task<IActionResult> ObtenerPorPerfume([FromRoute] Guid IdPerfume)
        {
            var resultado = await _notaFlujo.ObtenerPorPerfume(IdPerfume);
            if (!resultado.Any())
                return NoContent();
            return Ok(resultado);
        }

        [HttpPost("perfume")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AgregarAPerfume([FromBody] NotaPerfumeRequest request)
        {
            var resultado = await _notaFlujo.AgregarAPerfume(request);
            return Ok(resultado);
        }

        [HttpDelete("perfume/{IdPerfume}/nota/{IdNota}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> EliminarDePerfume([FromRoute] Guid IdPerfume, [FromRoute] Guid IdNota)
        {
            await _notaFlujo.EliminarDePerfume(IdPerfume, IdNota);
            return NoContent();
        }

        #endregion

        #region Helpers
        private async Task<bool> VerificarExiste(Guid Id)
        {
            var resultado = await _notaFlujo.Obtener(Id);
            return resultado != null;
        }
        #endregion
    }
}