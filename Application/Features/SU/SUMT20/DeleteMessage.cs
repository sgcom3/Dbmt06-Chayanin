using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using Domain.Entities.SU;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.SU.SUMT20
{
    public class DeleteMessage
    {
        public class Command : IRequest
        {
            public string MessageCode { get; set; }
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
                var message = await _context.Set<Message>().FirstOrDefaultAsync(m => m.MessageCode == request.MessageCode, cancellationToken);

                _context.Set<Message>().Remove(message);

                await _context.SaveChangesAsync(cancellationToken);

                return Unit.Value;
            }
        }
    }
}
