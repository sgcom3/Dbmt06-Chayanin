using Application.Common.Models;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Interfaces;

public interface ICleanDbContext : IDbContext
{
    Task<PageDto> GetPage(string sql, object param, RequestPageQuery page, CancellationToken token = default);
}
