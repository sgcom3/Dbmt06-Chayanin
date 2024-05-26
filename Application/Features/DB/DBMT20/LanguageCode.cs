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

namespace Application.Features.DB.DBMT20
{
    public class LanguageCode
    {
        public class languageCode
        {
            public string GroupCode { get; set; }

        }
        public class Query : IRequest<List<languageCode>>
        {
        }
        public class Handler : IRequestHandler<Query, List<languageCode>>
        {
            private readonly ICleanDbContext _context;

            public Handler(ICleanDbContext context)
            {
                _context = context;
            }

            public async Task<List<languageCode>> Handle(Query request, CancellationToken cancellationToken)
            {
                List<languageCode> parentGroupCodes = await _context.Set<Language>().AsNoTracking().Select(x => 
                new languageCode
                {
                    GroupCode = x.LanguageCode,
                }).ToListAsync();
                return parentGroupCodes;
            }
        }
    }
}
