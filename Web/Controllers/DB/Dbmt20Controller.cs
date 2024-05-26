using Application.Features.DB.DBMT04;
using Application.Features.DB.DBMT20;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Web.Controllers.DB.DBMT20
{
    public class Dbmt20Controller : BaseController
    {
        [HttpGet("languageList")]
        public async Task<IActionResult> Get([FromQuery] LanguageList.Query model)
        {
            return Ok(await Mediator.Send(model));
        }

        [HttpGet("languageDetail")]
        public async Task<IActionResult> Get([FromQuery] LanguageDetail.Query model)
        {
            return Ok(await Mediator.Send(model));
        }

        [HttpPost("saveLanguage")]
        public async Task<IActionResult> Post([FromBody] SaveLanguage.Command model)
        {
            await Mediator.Send(model);
            return NoContent();
        }

        [HttpDelete("deleteLanguage")]
        public async Task<IActionResult> Delete([FromQuery] DeleteLanguage.Command model)
        {
            return Ok(await Mediator.Send(model));
        }

        [HttpGet("languageCode")]
        public async Task<IActionResult> Get([FromQuery] LanguageCode.Query model)
        {
            return Ok(await Mediator.Send(model));
        }

    }
}
