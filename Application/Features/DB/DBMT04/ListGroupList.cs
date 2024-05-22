using Application.Common.Models;
using Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.DB.DBMT04
{
    public class ListGroupList
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
                
                                 
                sql.AppendLine("    SELECT		lg.group_code AS \"groupCode\",");
                sql.AppendLine("                lg.sequence AS \"sequence\",");
                sql.AppendLine("                lg.description AS \"description\",");
                sql.AppendLine("                lg.parent_group_code AS \"parentGroupCode\",");
                sql.AppendLine("                lg.active as \"active\" ,");
                sql.AppendLine("                lg.can_insert as \"canInsert\" ,");
                sql.AppendLine("                lg.can_delete as \"canDelete\" ,");
                sql.AppendLine("                lg.can_edit as \"canEdit\" ,");
                sql.AppendLine("                lg.system_control as \"systemControl\" ");
                sql.AppendLine("    FROM		db.list_group lg ");
                if (!string.IsNullOrWhiteSpace(request.Keyword))
                {
                    sql.AppendLine("WHERE       CONCAT(lg.group_code, lg.description)");
                    sql.AppendLine("            like CONCAT('%', @Keyword, '%')");
                }

                return await _context.GetPage(sql.ToString(), new { Keyword = request.Keyword }, request, cancellationToken);
            }
        }
    }
}
