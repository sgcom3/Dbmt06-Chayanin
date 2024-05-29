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
using Domain.Entities.SU;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.SU.SUMT20
{
    public class SaveMessage
    {
        public class Command : Message, ICommand
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
                    var dupplicated = await _context.Set<Message>().FirstOrDefaultAsync(m => m.MessageCode == request.MessageCode, cancellationToken);
                    if (dupplicated != null) throw new RestException(HttpStatusCode.BadRequest, "message.Dupplicated");
                    _context.Set<Message>().Add(request);
                }
                else
                {
                    if (await _context.Set<Message>().FirstOrDefaultAsync(m => m.MessageCode == request.MessageCode, cancellationToken) is Message messageItem)
                    {
                        messageItem.MessageDesc = request.MessageDesc;
                        messageItem.LanguageCode = request.LanguageCode;
                        messageItem.Remark = request.Remark;
                        _context.Entry(messageItem).State = EntityState.Modified;
                    }
                }

                await _context.SaveChangesAsync(cancellationToken);
                return Unit.Value;
            }
        }

    }
}
 
