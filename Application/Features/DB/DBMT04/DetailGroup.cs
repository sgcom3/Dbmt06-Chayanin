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
    public class DetailGroup
    {
        public class Query : IRequest<ListGroup>
        {
            public string GroupCode { get; set; }
        }
        public class Handler : IRequestHandler<Query, ListGroup>
        {
            private readonly ICleanDbContext _context;
            private readonly ICurrentUserAccessor _user;
            public Handler(ICleanDbContext context, ICurrentUserAccessor user)
            {
                _context = context;
                _user = user;
            }
            public async Task<ListGroup> Handle(Query request, CancellationToken cancellationToken)
            {
                var listGroup = await _context.Set<ListGroup>().AsNoTracking().FirstOrDefaultAsync(o => o.GroupCode == request.GroupCode, cancellationToken);
                if (listGroup == null) throw new RestException(System.Net.HttpStatusCode.BadRequest, "not found");
                return listGroup;
            }
        }
    }
}
