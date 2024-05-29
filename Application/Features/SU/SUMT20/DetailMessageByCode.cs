using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Application.Exceptions;
using Application.Interfaces;
using Domain.Entities.SU;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.SU.SUMT20
{
    public class DetailMessageByCode
    {
        public class Query : IRequest<Message>
        {
            public string messageCode { get; set; }
        }
        public class Handler : IRequestHandler<Query, Message>
        {
            private readonly ICleanDbContext _context;
            private readonly ICurrentUserAccessor _user;
            public Handler(ICleanDbContext context, ICurrentUserAccessor user)
            {
                _context = context;
                _user = user;
            }
            public async Task<Message> Handle(Query request, CancellationToken cancellationToken)
            {
                var value = await _context.Set<Message>().AsNoTracking().FirstOrDefaultAsync(o => o.MessageCode == request.messageCode, cancellationToken);
                if (value == null) throw new RestException(System.Net.HttpStatusCode.BadRequest, "NotFound");
                return value;
            }
        }
    }
}

