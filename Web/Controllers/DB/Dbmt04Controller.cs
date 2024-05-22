using Application.Features.DB.DBMT04;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Web.Controllers.DB.DBMT04
{
    public class Dbmt04Controller : BaseController
    {
        [HttpGet("SearchListGroup")]
        public async Task<IActionResult> Get([FromQuery] ListGroupList.Query model)
        {
            return Ok(await Mediator.Send(model));
        }

        [HttpGet("GetListGroupByGroupCode")]
        public async Task<IActionResult> Get([FromQuery] DetailGroup.Query model)
        {
            return Ok(await Mediator.Send(model));
        }
        
        [HttpPost("SaveListGroup")]
        public async Task<IActionResult> Post([FromBody] SaveGroup.Command model)
        {
            await Mediator.Send(model);
            return NoContent();
        }

        [HttpDelete("DeleteListGroup")]
        public async Task<IActionResult> Delete([FromQuery] DeleteGroup.Command model)
        {
            return Ok(await Mediator.Send(model));
        }

        [HttpGet("GetListValueByValueId")]
        public async Task<IActionResult> Get([FromQuery] DetailValue.Query model)
        {
            return Ok(await Mediator.Send(model));
        }

        [HttpGet("GetListValueByGroupAndValue")]
        public async Task<IActionResult> Get([FromQuery] DetailValueByCode.Query model)
        {
            return Ok(await Mediator.Send(model));
        }

        [HttpGet("SearchListValue")]
        public async Task<IActionResult> Get([FromQuery] ListValueList.Query model)
        {
            return Ok(await Mediator.Send(model));
        }

        [HttpPost("SaveListValue")]
        public async Task<IActionResult> Post([FromBody] SaveValue.Command model)
        {
            await Mediator.Send(model);
            return NoContent();
        }

        [HttpDelete("DeleteListValue")]
        public async Task<IActionResult> Delete([FromQuery] DeleteValue.Command model)
        {
            await Mediator.Send(model);
            return NoContent();
        }

        [HttpGet("master")]
        public async Task<IActionResult> Get([FromQuery] Master.Query model)
        {
            return Ok(await Mediator.Send(model));
        }
        [HttpGet("parentGroupCode")]
        public async Task<IActionResult> Get([FromQuery] ParentGroupCode.Query model)
        {
            return Ok(await Mediator.Send(model));
        }
    }
}
