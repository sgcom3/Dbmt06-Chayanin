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
    public class RegionList
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


                sql.AppendLine("    SELECT DISTINCT	tt.territory_code AS \"territoryCode\",");
                // sql.AppendLine("                tt.display_seq AS \"displaySeq\",");
                sql.AppendLine("                tt.active AS \"active\",");
                //sql.AppendLine("                tt.interface_mapping_code as \"interfaceMappingCode\" ,");
                sql.AppendLine("                tl.territory_name as \"territoryName\" ");
                sql.AppendLine("    FROM		db.territory tt");
                sql.AppendLine("    JOIN        db.territory_lang tl ON tt.territory_code = tl.territory_code");
                sql.AppendLine("    WHERE       tt.active = true");
                sql.AppendLine("    ORDER BY    tt.territory_code ASC");

                return await _context.GetPage(sql.ToString(), new { Keyword = request.Keyword }, request, cancellationToken);
            }
        }
    }
}
