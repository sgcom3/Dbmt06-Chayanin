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

namespace Application.Features.DB.DBMT20
{
    public class LanguageDetail
    {
        public class Query : IRequest<Language>
        {
            public string LanguageCode { get; set; }
        }
        public class Handler : IRequestHandler<Query, Language>
        {
            private readonly ICleanDbContext _context;
            private readonly ICurrentUserAccessor _user;
            public Handler(ICleanDbContext context, ICurrentUserAccessor user)
            {
                _context = context;
                _user = user;
            }
            public async Task<Language> Handle(Query request, CancellationToken cancellationToken)
            {
                var listGroup = await _context.Set<Language>().AsNoTracking().FirstOrDefaultAsync(o => o.LanguageCode == request.LanguageCode, cancellationToken);
                if (listGroup == null) throw new RestException(System.Net.HttpStatusCode.BadRequest, "not found");
                return listGroup;
            }
        }
    }
}
