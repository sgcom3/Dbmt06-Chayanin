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
    public class CurrencyList
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


                sql.AppendLine("    SELECT DISTINCT	cc.code AS \"currencyCode\",");
                sql.AppendLine("                cc.active AS \"active\",");
                sql.AppendLine("                cl.currency_name AS \"currencyName\" ");
                sql.AppendLine("    FROM		db.currency cc");
                sql.AppendLine("    JOIN        db.currency_lang cl ON cc.code = cl.currency_code");
                sql.AppendLine("    WHERE       cc.active = true AND cl.language_code = 'EN'");
                sql.AppendLine("    ORDER BY    cc.code ASC");

                return await _context.GetPage(sql.ToString(), new { Keyword = request.Keyword }, request, cancellationToken);
            }
        }
    }
}