﻿using Application.Common.Models;
using Application.Interfaces;
using MediatR;
using System;
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

                sql.AppendLine("SELECT ct.country_code AS \"countryCode\",");
                sql.AppendLine("       ct.tel_country_code AS \"telCountryCode\",");
                sql.AppendLine("       ct.active AS \"active\",");
                sql.AppendLine("       cl.country_name AS \"countryName\",");
                sql.AppendLine("       ct.zone_id as \"zoneId\",");
                sql.AppendLine("       ct.currency_code as \"currencyCode\",");
                sql.AppendLine("       ct.trunk_prefix as \"trunkPrefix\",");
                sql.AppendLine("       ct.description as \"description\",");
                sql.AppendLine("       ct.country_image as \"countryImage\",");
                sql.AppendLine("       ct.territory_code as \"territoryCode\",");
                sql.AppendLine("       ct.interface_mapping_code as \"interfaceMappingCode\"");
                sql.AppendLine("FROM   db.country ct");
                sql.AppendLine("       LEFT JOIN db.country_lang cl ON cl.country_code = ct.country_code");
                sql.AppendLine("WHERE  ct.active = true");


                if (!string.IsNullOrWhiteSpace(request.Keyword))
                {
                    sql.AppendLine("AND   CONCAT(LOWER(ct.country_code), LOWER(ct.description))");
                    sql.AppendLine("      LIKE CONCAT('%', LOWER(@Keyword), '%')");

                }

                sql.AppendLine("    ORDER BY    ct.country_code asc");

                return await _context.GetPage(sql.ToString(), new { Keyword = request.Keyword }, request, cancellationToken);
            }
        }
    }
} 