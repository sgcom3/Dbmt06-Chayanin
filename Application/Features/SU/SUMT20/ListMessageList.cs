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
    public class ListMessageList
    {
        public class Query : RequestPageQuery, IRequest<PageDto>
        {
            public string Keyword { get; set; }
            public string Lang { get; set; }
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

                sql.AppendLine("    SELECT		m.message_code AS \"messageCode\",");
                sql.AppendLine("                m.language_code AS \"languageCode\",");
                sql.AppendLine("                m.message_desc AS \"messageDesc\",");
                sql.AppendLine("                m.remark as \"remark\" ");
                sql.AppendLine("    FROM   su.message m  ");
                sql.AppendLine("    WHERE	    1=1");
                if (!string.IsNullOrWhiteSpace(request.Keyword))
                {
                    sql.AppendLine("AND       CONCAT(LOWER(m.message_code), LOWER(m.message_desc), LOWER(m.remark))");
                    sql.AppendLine("            like CONCAT('%', LOWER(@Keyword), '%')");
                }
                if (!string.IsNullOrWhiteSpace(request.Lang))
                {
                    sql.AppendLine("AND       LOWER(m.language_code) = LOWER(@Lang)");

                }
                return await _context.GetPage(sql.ToString(), new { Keyword = request.Keyword, Lang = request.Lang }, request, cancellationToken);

            }
        }
    }
}

