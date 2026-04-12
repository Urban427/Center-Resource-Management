namespace CRM.Services;
using CRM.Domain.Entities;
using CRM.Domain.Abstractions;
using Microsoft.EntityFrameworkCore;

public class HistoryService
{
    private readonly IEntityChangeSetRepository _history;
    public HistoryService(
        IEntityChangeSetRepository history)
    {
        _history = history;
    }

    public async Task<IReadOnlyList<EntityChangeSet>> getHistory(string entityName, string entityId)
    {
        var historySet = await _history.Query().AsNoTracking()
            .Where(h => h.EntityName.ToLower() == entityName.ToLower() && h.EntityId.ToLower() == entityId.ToLower())
            .OrderByDescending(h => h.ChangedAt)
            .ToListAsync();
        return historySet;
    }
}
