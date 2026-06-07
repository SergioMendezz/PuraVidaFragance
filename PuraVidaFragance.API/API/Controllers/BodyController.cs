using Abstracciones.Interfaces.API;
using Abstracciones.Interfaces.Flujo;
using Abstracciones.Modelos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BodyController : ControllerBase, IBodyController
    {
        private readonly IBodyFlujo _bodyFlujo;
        private readonly ILogger<BodyController> _logger;

        public BodyController(IBodyFlujo bodyFlujo, ILogger<BodyController> logger)
        {
            _bodyFlujo = bodyFlujo;
            _logger = logger;
        }

        #region Operaciones públicas (sin autenticación)

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> Obtener()
        {
            var resultado = await _bodyFlujo.Obtener();
            if (!resultado.Any())
                return NoContent();
            return Ok(resultado);
        }

        [HttpGet("{Id}")]
        [AllowAnonymous]
        public async Task<IActionResult> Obtener([FromRoute] Guid Id)
        {
            var resultado = await _bodyFlujo.Obtener(Id);
            if (resultado == null)
                return NotFound("No se encontró el body");
            return Ok(resultado);
        }

        #endregion

        #region Operaciones protegidas (solo admin)

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Agregar([FromBody] BodyRequest body)
        {
            var resultado = await _bodyFlujo.Agregar(body);
            return CreatedAtAction(nameof(Obtener), new { Id = resultado }, null);
        }

        [HttpPut("{Id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Editar([FromRoute] Guid Id, [FromBody] BodyRequest body)
        {
            if (!await VerificarExiste(Id))
                return NotFound("No se encontró el body");
            var resultado = await _bodyFlujo.Editar(Id, body);
            return Ok(resultado);
        }

        [HttpDelete("{Id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Eliminar([FromRoute] Guid Id)
        {
            if (!await VerificarExiste(Id))
                return NotFound("No se encontró el body");
            await _bodyFlujo.Eliminar(Id);
            return NoContent();
        }

        #endregion

        #region Helpers
        private async Task<bool> VerificarExiste(Guid Id)
        {
            var resultado = await _bodyFlujo.Obtener(Id);
            return resultado != null;
        }
        #endregion
    }
}