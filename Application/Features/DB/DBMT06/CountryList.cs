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
    public class CountryList
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


                sql.AppendLine("    SELECT DISTINCT		ct.country_code AS \"countryCode\",");
                sql.AppendLine("                ct.tel_country_code AS \"telCountryCode\",");
                sql.AppendLine("                ct.active AS \"active\",");
                sql.AppendLine("                ct.zone_id as \"zoneId\" ,");
                sql.AppendLine("                ct.currency_code as \"currencyCode\" ,");
                sql.AppendLine("                ct.trunk_prefix as \"trunkPrefix\" ,");
                sql.AppendLine("                ct.description as \"description\" ,");
                sql.AppendLine("                ct.country_image as \"countryImage\" ,");
                sql.AppendLine("                ct.territory_code as \"territoryCode\" ,");
                sql.AppendLine("                ct.interface_mapping_code as \"interfaceMappingCode\" ,");
                sql.AppendLine("                cl.country_name as \"countryName\" ,");
                sql.AppendLine("                tl.territory_name as \"territoryName\" ,");
                sql.AppendLine("                cc.currency_name as \"currencyName\" ");
                sql.AppendLine("    FROM		db.country ct ");

                sql.AppendLine("    LEFT JOIN        db.country_lang cl ON ct.country_code = cl.country_code AND cl.language_code = 'EN'");
                sql.AppendLine("    LEFT JOIN        db.territory_lang tl ON ct.territory_code = tl.territory_code");
                sql.AppendLine("    LEFT JOIN        db.currency_lang cc ON ct.currency_code = cc.currency_code");
              
              

                if (!string.IsNullOrWhiteSpace(request.Keyword))
                {
                    sql.AppendLine("WHERE       CONCAT(LOWER(ct.country_code),LOWER(cl.country_name))");
                    sql.AppendLine("            LIKE LOWER(CONCAT('%',@Keyword, '%'))");
                }

                sql.AppendLine("    ORDER BY    ct.country_code asc");

                return await _context.GetPage(sql.ToString(), new { Keyword = request.Keyword }, request, cancellationToken);
            }
        }
    }
} 