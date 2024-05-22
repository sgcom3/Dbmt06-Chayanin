using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Application.Behaviors;
using Application.Exceptions;
using Application.Interfaces;
using Domain.Entities.DB;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.DB.DBMT04
{
    public class SaveGroup
    {
        public class Command : Domain.Entities.DB.ListGroup, ICommand
        {

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
                if (request.RowState == Domain.Entities.RowState.Add)
                {
                    var dupplicated = await _context.Set<ListGroup>().FirstOrDefaultAsync(o => o.GroupCode == request.GroupCode, cancellationToken);
                    if (dupplicated != null)
                    {
                        throw new RestException(HttpStatusCode.NotFound, "message.Dupplicated");
                    }
                    _context.Set<Domain.Entities.DB.ListGroup>().Add(request);
                }
                else
                    _context.Entry(request).State = Microsoft.EntityFrameworkCore.EntityState.Modified;

                await _context.SaveChangesAsync(cancellationToken);
                return Unit.Value;
            }
        }
    }
}
