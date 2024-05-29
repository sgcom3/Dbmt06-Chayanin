using Application.Features.SU.SUMT20;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Web.Controllers.SU.SUMT20
{

    public class Sumt20Controller : BaseController
    {
        [HttpGet("SearchMessage")]
        public async Task<IActionResult> Get([FromQuery] ListMessageList.Query model)
        {
            return Ok(await Mediator.Send(model));
        }
        [HttpGet("GetLanguage")]
        public async Task<IActionResult> Get([FromQuery] Language.Query model)
        {
            return Ok(await Mediator.Send(model));
        }
        [HttpDelete("DeleteMessage")]
        public async Task<IActionResult> DeleteMessage([FromQuery] DeleteMessage.Command model)
        {
            return Ok(await Mediator.Send(model));
        }
        [HttpGet("GetMessageByCode")]
        public async Task<IActionResult> GetMessageByCode([FromQuery] DetailMessageByCode.Query model)
        {
            return Ok(await Mediator.Send(model));
        }
        [HttpPost("SaveMessage")]
        public async Task<IActionResult> Post([FromBody] SaveMessage.Command model)
        {
            await Mediator.Send(model);
            return NoContent();
        }
    }
}