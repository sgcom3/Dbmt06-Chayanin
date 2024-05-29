using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Models;
using Application.Interfaces;
using MediatR;

namespace Application.Features.SU.SUMT20
{
    public class Language
    {
        public class Query : RequestPageQuery, IRequest<PageDto>
        {
            public string Keyword { get; set; }
        }

        public class Handler : IRequestHandler<Query, PageDto>
        {
            private readonly ICleanDbContext _context;
            private readonly ICurrentUserAccessor _user;

            public Handler(ICleanDbContext context, ICurrentUserAccessor user)
            {
                _context = context;
                _user = user;
            }

            public async Task<PageDto> Handle(Query request, CancellationToken cancellationToken)
            {
                StringBuilder sql = new StringBuilder();

                sql.AppendLine("    SELECT		l.language_code AS \"languageCode\"");
                sql.AppendLine("    FROM   db.language l  ");
                sql.AppendLine("    WHERE   l.active = true ");
                return await _context.GetPage(sql.ToString(), new { Keyword = request.Keyword }, request, cancellationToken);
            }
        }
    }
}
