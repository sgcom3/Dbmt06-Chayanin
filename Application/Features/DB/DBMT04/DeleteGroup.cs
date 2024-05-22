using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Application.Behaviors;
using Application.Interfaces;
using Domain.Entities.DB;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.DB.DBMT04
{
    public class DeleteGroup
    {
        public class Command : ICommand
        {
            public string GroupCode { get; set; }
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
                var group = await _context.Set<ListGroup>().FirstOrDefaultAsync(o => o.GroupCode == request.GroupCode, cancellationToken);
                group.Active = false;
                _context.Entry(group).State = EntityState.Modified;

                await _context.SaveChangesAsync(cancellationToken);
                return Unit.Value;
            }
        }
    }
}
