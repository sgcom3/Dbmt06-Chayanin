using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Models;
using Application.Interfaces;
using MediatR;

namespace Application.Features.DB.DBMT04
{
    public class ListValueList
    {
        public class Query : RequestPageQuery, IRequest<PageDto>
        {
            public string Keyword { get; set; }
            public string GroupCode { get; set; }
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

                sql.AppendLine("    SELECT		lv.value_id AS \"valueId\",");
                sql.AppendLine("                lv.group_code AS \"groupCode\",");
                sql.AppendLine("                lv.value AS \"value\",");
                sql.AppendLine("                lvl.value_text AS \"valueText\",");
                sql.AppendLine("                lv.description as \"description\" ,");
                sql.AppendLine("                lv.parent_group_code as \"parentGroupCode\" ,");
                sql.AppendLine("                lv.parent_value as \"parentValue\" ,");
                sql.AppendLine("                lv.sequence as \"sequence\" ,");
                sql.AppendLine("                lv.interface_mapping_code as \"interfaceMappingCode\" ,");
                sql.AppendLine("                lv.active AS \"active\" ");
                sql.AppendLine("    FROM   db.list_value lv  ");
                sql.AppendLine("    LEFT JOIN db.list_value_lang lvl  ON lvl.value = lv.value ");
                sql.AppendLine("                                               AND lvl.group_code = @GroupCode ");
                sql.AppendLine("                                               AND lvl.language_code =  @Lang ");
                sql.AppendLine("    WHERE		1 = 1");
                if (!string.IsNullOrWhiteSpace(request.Keyword))
                {
                    sql.AppendLine("AND       CONCAT(lvl.value_text, lv.description)");
                    sql.AppendLine("            like CONCAT('%', @Keyword, '%')");
                }
                if (!string.IsNullOrWhiteSpace(request.GroupCode))
                {
                    sql.AppendLine("AND       lv.group_code = @GroupCode");

                }

                return await _context.GetPage(sql.ToString(), new { Keyword = request.Keyword, GroupCode = request.GroupCode , Lang = _user.Language }, request, cancellationToken);
            }
        }
    }
}
