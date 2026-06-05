using Abstracciones.Interfaces.API;
using Abstracciones.Interfaces.Flujo;
using Abstracciones.Modelos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class MarcaController : ControllerBase, IMarcaController
    {
        private readonly IMarcaFlujo _marcaFlujo;
        private readonly ILogger<MarcaController> _logger;

        public MarcaController(IMarcaFlujo marcaFlujo, ILogger<MarcaController> logger)
        {
            _marcaFlujo = marcaFlujo;
            _logger = logger;
        }

        #region Operaciones

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> Obtener()
        {
            var resultado = await _marcaFlujo.Obtener();
            if (!resultado.Any())
                return NoContent();
            return Ok(resultado);
        }

        [HttpGet("{Id}")]
        [AllowAnonymous]
        public async Task<IActionResult> Obtener([FromRoute] Guid Id)
        {
            var resultado = await _marcaFlujo.Obtener(Id);
            if (resultado == null)
                return NotFound("No se encontró la marca");
            return Ok(resultado);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Agregar([FromBody] MarcaRequest marca)
        {
            var resultado = await _marcaFlujo.Agregar(marca);
            return CreatedAtAction(nameof(Obtener), new { Id = resultado }, null);
        }

        [HttpPut("{Id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Editar([FromRoute] Guid Id, [FromBody] MarcaRequest marca)
        {
            if (!await VerificarExiste(Id))
                return NotFound("No se encontró la marca");
            var resultado = await _marcaFlujo.Editar(Id, marca);
            return Ok(resultado);
        }

        [HttpDelete("{Id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Eliminar([FromRoute] Guid Id)
        {
            if (!await VerificarExiste(Id))
                return NotFound("No se encontró la marca");
            await _marcaFlujo.Eliminar(Id);
            return NoContent();
        }

        #endregion

        #region Helpers
        private async Task<bool> VerificarExiste(Guid Id)
        {
            var resultado = await _marcaFlujo.Obtener(Id);
            return resultado != null;
        }
        #endregion
    }
}