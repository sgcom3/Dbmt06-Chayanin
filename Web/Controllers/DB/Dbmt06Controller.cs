using Application.Features.DB.DBMT04;
using Application.Features.DB.DBMT06;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Web.Controllers.DB.DBMT06
{
   
    public class Dbmt06Controller : BaseController
    {
        [HttpGet("Countries")]
        public async Task<IActionResult> Get([FromQuery] CountryList.Query model)
        {
            return Ok(await Mediator.Send(model));
        }

        [HttpGet("GetCountryByCountryCode")]
        public async Task<IActionResult> Get([FromQuery] DetailCountry.Query model)
        {
            return Ok(await Mediator.Send(model));
        }

        [HttpPost("SaveCountry")]
        public async Task<IActionResult> Post([FromBody] SaveCountry.Command model)
        {
            await Mediator.Send(model);
            return NoContent();
        }

        [HttpDelete("DeleteCountry")]
        public async Task<IActionResult> Delete([FromQuery] DeleteCountry.Command model)
        {
            return Ok(await Mediator.Send(model));
        }


    }
}
