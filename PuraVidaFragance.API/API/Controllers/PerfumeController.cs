using Abstracciones.Interfaces.API;
using Abstracciones.Interfaces.Flujo;
using Abstracciones.Modelos;
//using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PerfumeController : ControllerBase, IPerfumeController
    {
        private readonly IPerfumeFlujo _perfumeFlujo;
        private readonly ILogger<PerfumeController> _logger;

        public PerfumeController(IPerfumeFlujo perfumeFlujo, ILogger<PerfumeController> logger)
        {
            _perfumeFlujo = perfumeFlujo;
            _logger = logger;
        }

        #region Operaciones públicas (sin autenticación)

        [HttpGet]
        //[AllowAnonymous]
        public async Task<IActionResult> Obtener()
        {
            var resultado = await _perfumeFlujo.Obtener();
            if (!resultado.Any())
                return NoContent();
            return Ok(resultado);
        }

        [HttpGet("{Id}")]
        //[AllowAnonymous]
        public async Task<IActionResult> Obtener([FromRoute] Guid Id)
        {
            var resultado = await _perfumeFlujo.Obtener(Id);
            if (resultado == null)
                return NotFound("No se encontró el perfume");
            return Ok(resultado);
        }

        #endregion

        #region Operaciones protegidas (solo admin)

        [HttpPost]
        //[Authorize(Roles = "Admin")]
        public async Task<IActionResult> Agregar([FromBody] PerfumeRequest perfume)
        {
            var resultado = await _perfumeFlujo.Agregar(perfume);
            return CreatedAtAction(nameof(Obtener), new { Id = resultado }, null);
        }

        [HttpPut("{Id}")]
        //[Authorize(Roles = "Admin")]
        public async Task<IActionResult> Editar([FromRoute] Guid Id, [FromBody] PerfumeRequest perfume)
        {
            if (!await VerificarExiste(Id))
                return NotFound("No se encontró el perfume");
            var resultado = await _perfumeFlujo.Editar(Id, perfume);
            return Ok(resultado);
        }

        [HttpDelete("{Id}")]
        //[Authorize(Roles = "Admin")]
        public async Task<IActionResult> Eliminar([FromRoute] Guid Id)
        {
            if (!await VerificarExiste(Id))
                return NotFound("No se encontró el perfume");
            await _perfumeFlujo.Eliminar(Id);
            return NoContent();
        }

        #endregion

        #region Helpers
        private async Task<bool> VerificarExiste(Guid Id)
        {
            var resultado = await _perfumeFlujo.Obtener(Id);
            return resultado != null;
        }
        #endregion
    }
}