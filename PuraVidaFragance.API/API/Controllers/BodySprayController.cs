using Abstracciones.Interfaces.API;
using Abstracciones.Interfaces.Flujo;
using Abstracciones.Modelos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BodySprayController : ControllerBase, IBodySprayController
    {
        private readonly IBodySprayFlujo _bodySprayFlujo;
        private readonly ILogger<BodySprayController> _logger;

        public BodySprayController(IBodySprayFlujo bodySprayFlujo, ILogger<BodySprayController> logger)
        {
            _bodySprayFlujo = bodySprayFlujo;
            _logger = logger;
        }

        #region Operaciones públicas (sin autenticación)

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> Obtener()
        {
            var resultado = await _bodySprayFlujo.Obtener();
            if (!resultado.Any())
                return NoContent();
            return Ok(resultado);
        }

        [HttpGet("{Id}")]
        [AllowAnonymous]
        public async Task<IActionResult> Obtener([FromRoute] Guid Id)
        {
            var resultado = await _bodySprayFlujo.Obtener(Id);
            if (resultado == null)
                return NotFound("No se encontró el body spray");
            return Ok(resultado);
        }

        #endregion

        #region Operaciones protegidas (solo admin)

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Agregar([FromBody] BodySprayRequest bodySpray)
        {
            var resultado = await _bodySprayFlujo.Agregar(bodySpray);
            return CreatedAtAction(nameof(Obtener), new { Id = resultado }, null);
        }

        [HttpPut("{Id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Editar([FromRoute] Guid Id, [FromBody] BodySprayRequest bodySpray)
        {
            if (!await VerificarExiste(Id))
                return NotFound("No se encontró el body spray");
            var resultado = await _bodySprayFlujo.Editar(Id, bodySpray);
            return Ok(resultado);
        }

        [HttpDelete("{Id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Eliminar([FromRoute] Guid Id)
        {
            if (!await VerificarExiste(Id))
                return NotFound("No se encontró el body spray");
            await _bodySprayFlujo.Eliminar(Id);
            return NoContent();
        }

        [HttpPatch("{Id}/activar")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Activar([FromRoute] Guid Id)
        {
            var resultado = await _bodySprayFlujo.Activar(Id);
            return Ok(resultado);
        }

        #endregion

        #region Helpers
        private async Task<bool> VerificarExiste(Guid Id)
        {
            var resultado = await _bodySprayFlujo.Obtener(Id);
            return resultado != null;
        }
        #endregion
    }
}