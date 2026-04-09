using CRM.Domain.Entities;
using CRM.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Repositories;

public class TrashRepository: RepositoryBase
{
    public TrashRepository(AppDbContext db) : base(db) { }
    // Add a new TrashBinElement
    public async Task<TrashBinElement> AddAsync(TrashBinElement element)
    {
        _context.Set<TrashBinElement>().Add(element);
        await _context.SaveChangesAsync();
        return element;
    }
    //Remove element
    public async Task RemoveAsync(TrashBinElement element)
    {
        _context.Set<TrashBinElement>().Remove(element);
        await _context.SaveChangesAsync();
    }

    // Get TrashBinElement by Id
    public async Task<TrashBinElement?> GetByIdAsync(int id)
    {
        return await _context.Set<TrashBinElement>().FindAsync(id);
    }
    public async Task<List<TrashBinElement>> GetRangeAsync(int skip = 0, int take = 10)
    {
        // Ensure take is positive
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

}
