namespace CRM.Services; 
using CRM.Domain.Entities;
using CRM.Domain.Enums;
using CRM.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

public class HistoryService
{
    private readonly EntityChangeSetRepository _history;
    public HistoryService(
        EntityChangeSetRepository history)
    {
        _history = history;
    }

    public async Task<IReadOnlyList<EntityChangeSet>> getHistory(string entityName, string entityId)
    {
        var historySet = await _history.Context.EntityChangeSets.AsQueryable()
            .Where(h => h.EntityName.ToLower() == entityName.ToLower() && h.EntityId.ToLower() == entityId.ToLower())
            .OrderByDescending(h => h.ChangedAt)
            .ToListAsync();
        return historySet;
    }
}
