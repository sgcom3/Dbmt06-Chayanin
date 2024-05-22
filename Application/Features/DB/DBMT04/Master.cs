using Application.Common.Constants;
using Application.Common.Models;
using Application.Interfaces;
using Domain.Entities.DB;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.DB.DBMT04
{
    public class Master
    {
        public class MasterData
        {
            public List<ListVm> LangCodes { get; set; }

        }
        public class Query : IRequest<MasterData>
        {
        }
        public class Handler : IRequestHandler<Query, MasterData>
        {
            private readonly ICleanDbContext _context;

            private readonly ICurrentUserAccessor _user;

            public Handler(ICleanDbContext context, ICurrentUserAccessor user)
            {
                _context = context;
                _user = user;
            }

            public async Task<MasterData> Handle(Query request, CancellationToken cancellationToken)
            {
                var master = new MasterData();
                master.LangCodes = await this.GetLanguage(cancellationToken);
                return master;
            }

            private Task<List<ListVm>> GetLanguage(CancellationToken cancellationToken)
            {
                var result = (from lang in _context.Set<Language>().Where(x => x.LanguageCode.ToLower() == (_user.Language ?? "EN").ToLower() && x.Active == true)
                              from langLabel in _context.Set<LanguageLang>().Where(x => x.LanguageCodeForName == lang.LanguageCode && x.LanguageCode == lang.LanguageCode)
                              orderby lang.LanguageCode
                              select new ListVm()
                              {
                                  Text = langLabel.LanguageName,
                                  Value = lang.LanguageCode
                              }).ToListAsync(cancellationToken);


                return result;
            }
        }
    }
}
