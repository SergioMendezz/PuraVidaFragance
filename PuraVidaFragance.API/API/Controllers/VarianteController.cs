using Abstracciones.Interfaces.API;
using Abstracciones.Interfaces.Flujo;
using Abstracciones.Modelos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VarianteController : ControllerBase, IVarianteController
    {
        private readonly IVarianteFlujo _varianteFlujo;
        private readonly ILogger<VarianteController> _logger;

        public VarianteController(IVarianteFlujo varianteFlujo, ILogger<VarianteController> logger)
        {
            _varianteFlujo = varianteFlujo;
            _logger = logger;
        }

        [HttpGet("perfume/{IdPerfume}")]
        [AllowAnonymous]
        public async Task<IActionResult> ObtenerPorPerfume([FromRoute] Guid IdPerfume)
        {
            var resultado = await _varianteFlujo.ObtenerPorPerfume(IdPerfume);
            if (!resultado.Any())
                return NoContent();
            return Ok(resultado);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Agregar([FromBody] VarianteRequest variante)
        {
            var resultado = await _varianteFlujo.Agregar(variante);
            return Ok(resultado);
        }

        [HttpPut("{Id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Editar([FromRoute] Guid Id, [FromBody] VarianteRequest variante)
        {
            var resultado = await _varianteFlujo.Editar(Id, variante);
            return Ok(resultado);
        }

        [HttpDelete("{Id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Eliminar([FromRoute] Guid Id)
        {
            await _varianteFlujo.Eliminar(Id);
            return NoContent();
        }
    }
}