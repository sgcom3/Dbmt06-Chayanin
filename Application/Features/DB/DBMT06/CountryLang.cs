using Application.Common.Models;
using Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.DB.DBMT06
{
    public class CountryLang
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


                sql.AppendLine("    SELECT DISTINCT		cl.country_code AS \"countryCode\",");
                sql.AppendLine("                cl.country_name as \"countryName\" ");
                sql.AppendLine("    FROM		db.country_lang cl ");
                sql.AppendLine("    WHERE		cl.language_code = 'EN'");
                
                // if (!string.IsNullOrWhiteSpace(request.Keyword))
                // {
                //     sql.AppendLine("WHERE       CONCAT(LOWER(ct.country_code),LOWER(cl.country_name))");
                //     sql.AppendLine("            LIKE LOWER(CONCAT('%',@Keyword, '%'))");
                // }

                //sql.AppendLine("    ORDER BY    ct.country_code asc");

                return await _context.GetPage(sql.ToString(), new { Keyword = request.Keyword }, request, cancellationToken);
            }
        }
    }
} 