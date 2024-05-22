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

namespace Application.Features.DB.DBMT04
{
    public class DetailValueByCode
    {
        public class Query : IRequest<Domain.Entities.DB.ListValue>
        {
            public string GroupCode { get; set; }
            public string Value { get; set; }
        }
        public class Handler : IRequestHandler<Query, Domain.Entities.DB.ListValue>
        {
            private readonly ICleanDbContext _context;
            private readonly ICurrentUserAccessor _user;
            public Handler(ICleanDbContext context, ICurrentUserAccessor user)
            {
                _context = context;
                _user = user;
            }
            public async Task<Domain.Entities.DB.ListValue> Handle(Query request, CancellationToken cancellationToken)
            {
                var value = await _context.Set<ListValue>().Include(i => i.ListValueLangs).Where(o => o.GroupCode == request.GroupCode && o.Value == request.Value).AsNoTracking().FirstOrDefaultAsync(cancellationToken);
                if (value == null) throw new RestException(System.Net.HttpStatusCode.NotFound, "message.NotFound");
                return value;
            }
        }
    }
}
