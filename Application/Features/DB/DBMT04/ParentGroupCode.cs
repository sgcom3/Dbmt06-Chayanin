using Application.Common.Models;
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
    public class ParentGroupCode
    {
        public class ParentGroupCodes
        {
            public string GroupCode { get; set; }

        }
        public class Query : IRequest<List<ParentGroupCodes>>
        {
        }
        public class Handler : IRequestHandler<Query, List<ParentGroupCodes>>
        {
            private readonly ICleanDbContext _context;

            public Handler(ICleanDbContext context)
            {
                _context = context;
            }

            public async Task<List<ParentGroupCodes>> Handle(Query request, CancellationToken cancellationToken)
            {
                List<ParentGroupCodes> parentGroupCodes = await _context.Set<ListGroup>().AsNoTracking().Select(x => 
                new ParentGroupCodes
                {
                    GroupCode = x.GroupCode,
                }).ToListAsync();
                return parentGroupCodes;
            }
        }
    }
}
