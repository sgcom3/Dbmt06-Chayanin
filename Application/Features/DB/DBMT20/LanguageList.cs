using Application.Common.Models;
using Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.DB.DBMT20
{
    public class LanguageList
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
                
                                 
                sql.AppendLine("    SELECT		lg.language_code AS \"languageCode\",");
                sql.AppendLine("                lg.description AS \"description\",");
                sql.AppendLine("                lg.active AS \"active\" ");
                sql.AppendLine("    FROM		db.language lg ");
                if (!string.IsNullOrWhiteSpace(request.Keyword))
                {
                    sql.AppendLine("WHERE       CONCAT(LOWER(lg.language_code), LOWER(lg.description))");
                    sql.AppendLine("            like CONCAT('%', LOWER(@Keyword), '%')");
                }

                return await _context.GetPage(sql.ToString(), new { Keyword = request.Keyword }, request, cancellationToken);
            }
        }
    }
}
