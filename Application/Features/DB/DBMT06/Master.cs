using Application.Common.Constants;
using Application.Common.Models;
using Application.Interfaces;
using Domain.Entities.DB;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.DB.DBMT06
{
    public class Master
    {
        public class MasterData
        {
            public List<ListVm> countryCodes { get; set; }

        }
        public class Query : IRequest<MasterData>
        {
        }
        public class Handler : IRequestHandler<Query, MasterData>
        {
            private readonly ICleanDbContext _context;

            private readonly ICurrentUserAccessor _user;

            public Handler(ICleanDbContext context, ICurrentUserAccessor user)
            {
                _context = context;
                _user = user;
            }

            public async Task<MasterData> Handle(Query request, CancellationToken cancellationToken)
            {
                var master = new MasterData();
                master.countryCodes = await this.GetCountry(cancellationToken);
                return master;
            }

            private Task<List<ListVm>> GetCountry(CancellationToken cancellationToken)
            {
                var result = (from country in _context.Set<Country>().Where(x => x.CountryCode.ToLower() == (_user.Country ?? "EN").ToLower() && x.Active == true)
                              from countryLabel in _context.Set<CountryLang>().Where(x => x.CountryCode == country.CountryCode)
                              orderby country.CountryCode
                              select new ListVm()
                              {
                                  Text = countryLabel.CountryName,
                                  Value = country.CountryCode

                              }).ToListAsync(cancellationToken);


                return result;
            }
        }
    }
}
