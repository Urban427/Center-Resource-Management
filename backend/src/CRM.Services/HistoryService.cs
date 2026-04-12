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

    public List<HistoryAnomaly> SearchAnomalies(List<EntityChangeSet> records)
    {
        var anomalies = new List<HistoryAnomaly>();
        var sorted = records.OrderBy(r => r.ChangedAt).ToList();
        var groups = sorted.GroupBy(r => new { r.EntityName, r.EntityId });
        foreach (var group in groups) {
            var list = group.ToList();
            for (int i = 1; i < list.Count; i++) {
                var prev = list[i - 1];
                var current = list[i];
                var diff = (current.ChangedAt - prev.ChangedAt).TotalSeconds;
                if (diff < 5) {
                    bool isBackAndForth = false;
                    if (prev.Changes != null && current.Changes != null) {
                        foreach (var prevChange in prev.Changes) {
                            var currChange = current.Changes.FirstOrDefault(c => c.PropertyName == prevChange.PropertyName);
                            if (currChange != null) {
                                if (prevChange.OldValue == currChange.NewValue && prevChange.NewValue == currChange.OldValue) {
                                    isBackAndForth = true;
                                    break;
                                }
                            }
                        }
                    }
                    if (isBackAndForth) {
                        anomalies.Add(new HistoryAnomaly {
                            EntityName = current.EntityName,
                            EntityId = current.EntityId,
                            Type = "туда-обратно",
                            DetectedAt = current.ChangedAt,
                            RelatedChanges = new List<EntityChangeSet> { prev, current }
                        });
                    }
                    else {
                        anomalies.Add(new HistoryAnomaly {
                            EntityName = current.EntityName,
                            EntityId = current.EntityId,
                            Type = "высокая частота",
                            DetectedAt = current.ChangedAt,
                            RelatedChanges = new List<EntityChangeSet> { prev, current }
                        });
                    }
                }
            }
        }
        return anomalies;
    }
}
