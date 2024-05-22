using Application.Behaviors;
using Application.Exceptions;
using Application.Interfaces;
using Domain.Entities.DB;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.DB.DBMT04
{
    public class SaveValue
    {
        public class Command : ListValue, ICommand
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
                    var dupplicated = await _context.Set<ListValue>().FirstOrDefaultAsync(o => o.GroupCode == request.GroupCode && o.Value == request.Value, cancellationToken);
                    if (dupplicated != null)
                    {
                        throw new RestException(HttpStatusCode.NotFound, "message.Dupplicated");
                    }
                    _context.Set<ListValue>().Add(request);
                }
                else
                {
                    foreach (var lang in request.ListValueLangs)
                    {
                        _context.Entry(lang).Property(o => o.ValueText).IsModified = true;
                    }

                    _context.Set<ListValue>().Attach(request);
                    _context.Entry(request).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
                    _context.Entry(request).Property(x => x.ValueId).IsModified = false;
                }
                await _context.SaveChangesAsync(cancellationToken);
                return Unit.Value;
            }
        }
    }
}
