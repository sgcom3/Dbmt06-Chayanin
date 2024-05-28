using Application.Exceptions;
using Application.Interfaces;
using Domain.Entities.DB;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.DB.DBMT06
{
    public class DetailCountry
    {
        public class Query : IRequest<Country>
        {
            public string CountryCode { get; set; }
        }
        public class Handler : IRequestHandler<Query, Country>
        {
            private readonly ICleanDbContext _context;
            private readonly ICurrentUserAccessor _user;
            public Handler(ICleanDbContext context, ICurrentUserAccessor user)
            {
                _context = context;
                _user = user;
            }
            public async Task<Country> Handle(Query request, CancellationToken cancellationToken)
            {
                var country = await _context.Set<Country>().AsNoTracking().FirstOrDefaultAsync(o => o.CountryCode == request.CountryCode, cancellationToken);
                if (country == null) throw new RestException(System.Net.HttpStatusCode.BadRequest, "not found");
                return country;
            }
        }
    }
}
