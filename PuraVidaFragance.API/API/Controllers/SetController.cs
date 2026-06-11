using Abstracciones.Interfaces.API;
using Abstracciones.Interfaces.Flujo;
using Abstracciones.Modelos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SetController : ControllerBase, ISetController
    {
        private readonly ISetFlujo _setFlujo;
        private readonly ILogger<SetController> _logger;

        public SetController(ISetFlujo setFlujo, ILogger<SetController> logger)
        {
            _setFlujo = setFlujo;
            _logger = logger;
        }

        #region Operaciones públicas (sin autenticación)

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> Obtener()
        {
            var resultado = await _setFlujo.Obtener();
            if (!resultado.Any())
                return NoContent();
            return Ok(resultado);
        }

        [HttpGet("{Id}")]
        [AllowAnonymous]
        public async Task<IActionResult> Obtener([FromRoute] Guid Id)
        {
            var resultado = await _setFlujo.Obtener(Id);
            if (resultado == null)
                return NotFound("No se encontró el set");
            return Ok(resultado);
        }

        #endregion

        #region Operaciones protegidas (solo admin)

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Agregar([FromBody] SetRequest set)
        {
            var resultado = await _setFlujo.Agregar(set);
            return CreatedAtAction(nameof(Obtener), new { Id = resultado }, null);
        }

        [HttpPut("{Id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Editar([FromRoute] Guid Id, [FromBody] SetRequest set)
        {
            if (!await VerificarExiste(Id))
                return NotFound("No se encontró el set");
            var resultado = await _setFlujo.Editar(Id, set);
            return Ok(resultado);
        }

        [HttpDelete("{Id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Eliminar([FromRoute] Guid Id)
        {
            if (!await VerificarExiste(Id))
                return NotFound("No se encontró el set");
            await _setFlujo.Eliminar(Id);
            return NoContent();
        }

        [HttpPatch("{Id}/activar")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Activar([FromRoute] Guid Id)
        {
            var resultado = await _setFlujo.Activar(Id);
            return Ok(resultado);
        }

        #endregion

        #region Helpers
        private async Task<bool> VerificarExiste(Guid Id)
        {
            var resultado = await _setFlujo.Obtener(Id);
            return resultado != null;
        }
        #endregion
    }
}