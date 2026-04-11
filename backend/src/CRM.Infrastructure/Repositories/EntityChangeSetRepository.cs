using CRM.Domain.Entities;
using CRM.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
namespace CRM.Infrastructure.Repositories;
public class EntityChangeSetRepository : RepositoryBase
{
    public EntityChangeSetRepository(AppDbContext db) : base(db) { }

    public async Task<EntityChangeSet?> GetByIdAsync(long id)
    {
        return await _context.EntityChangeSets
            .Include(x => x.Changes)
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<IReadOnlyList<EntityChangeSet>> GetByEntityAsync(string entityName, string entityId)
    {
        return await _context.EntityChangeSets
            .Where(x => x.EntityName == entityName && x.EntityId == entityId)
            .Include(x => x.Changes)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task AddAsync(EntityChangeSet changeSet)
    {
        await _context.EntityChangeSets.AddAsync(changeSet);
    }

    public async Task DeleteAsync(long id)
    {
        var entity = await _context.EntityChangeSets.FindAsync(id);
        if (entity == null)
            return;

        _context.EntityChangeSets.Remove(entity);
    }
}
