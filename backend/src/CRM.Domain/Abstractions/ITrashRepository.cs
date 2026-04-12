using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CRM.Domain.Entities;

namespace CRM.Domain.Abstractions;

public interface ITrashRepository
{
    public Task AddAsync(TrashBinElement element);
    public Task RemoveAsync(TrashBinElement element);
    public Task<TrashBinElement?> GetByIdAsync(int id);
    public Task<List<TrashBinElement>> GetRangeAsync(int skip = 0, int take = 10);
    public Task<List<TrashBinElement>> GetExpiredAsync();
    public Task<object?> FindEntityAsync(Type type, object key);
    public Type GetEntityClrType(string name);
    IQueryable<TrashBinElement> Query();
}
