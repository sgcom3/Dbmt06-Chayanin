using Application.Common.Models;
using Application.Interfaces;
using MediatR;
using System;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.DB.DBMT06
{
    public class getRegion
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

                sql.AppendLine("SELECT DISTINCT c.territory_code AS \"RegionCode\"");
                sql.AppendLine("FROM   db.country c");
               

                return await _context.GetPage(sql.ToString(), new { Keyword = request.Keyword }, request, cancellationToken);
            }
        }
    }
}
