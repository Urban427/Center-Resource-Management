using CRM.Domain.Entities;
using CRM.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using CRM.Domain.Abstractions;

namespace CRM.Infrastructure.Repositories;
public class TrashRepository : RepositoryBase, ITrashRepository
{
    public TrashRepository(AppDbContext db) : base(db) { }
    public Task AddAsync(TrashBinElement element)
    {
        _context.Set<TrashBinElement>().Add(element);
        return Task.CompletedTask;
    }
    public Task RemoveAsync(TrashBinElement element)
    {
        _context.Set<TrashBinElement>().Remove(element);
        return Task.CompletedTask;
    }
    public async Task<TrashBinElement?> GetByIdAsync(int id)
    {
        return await _context.Set<TrashBinElement>().FindAsync(id);
    }
    public async Task<List<TrashBinElement>> GetRangeAsync(int skip = 0, int take = 10)
    {
        if (take <= 0) take = 10;
        return await _context.Set<TrashBinElement>()
            .OrderBy(x => x.Id)
            .Skip(skip)
            .Take(take)
            .ToListAsync();
    }
    public async Task<List<TrashBinElement>> GetExpiredAsync()
    {
        return await _context.Set<TrashBinElement>()
            .Where(x => x.ExpiresAt <= DateTime.UtcNow)
            .ToListAsync();
    }
    public async Task<object?> FindEntityAsync(Type type, object key)
    {
        return await _context.FindAsync(type, key);
    }
    public Type GetEntityClrType(string name)
    {
        return _context.Model.GetEntityTypes()
            .First(x => x.ClrType.Name == name)
            .ClrType;
    }
    public IQueryable<TrashBinElement> Query()
    {
        return _context.TrashBinElements.AsQueryable();
    }
}
