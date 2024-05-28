using Application.Behaviors;
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
    public class DeleteCountry
    {
        public class Command : ICommand
        {
            public string CountryCode { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly ICleanDbContext _context;
            private readonly ICurrentUserAccessor _user;
            public Handler(ICleanDbContext context, ICurrentUserAccessor user)
            {
                _context = context;
                _user = user;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var country = await _context.Set<Country>().FirstOrDefaultAsync(o => o.CountryCode == request.CountryCode, cancellationToken);
                country.Active = false;
                _context.Entry(country).State = EntityState.Modified;

                await _context.SaveChangesAsync(cancellationToken);
                return Unit.Value;
            }
        }
    }
}
