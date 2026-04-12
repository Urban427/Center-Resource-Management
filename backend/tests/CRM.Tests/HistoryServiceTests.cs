using Moq;
using Xunit;
using CRM.Services;
using CRM.Domain.Entities;
using CRM.Domain.Enums;
using CRM.Infrastructure.Repositories;
using CRM.Domain.Abstractions;

namespace CRM.Tests;
public class HistoryServiceTests
{
    private EntityChangeSet CreateRecord(
        DateTime time,
        string property,
        string oldVal,
        string newVal)
    {
        return new EntityChangeSet
        {
            EntityName = "Device",
            EntityId = "1",
            ChangedAt = time,
            Changes = new List<EntityChange>
            {
                new EntityChange
                {
                    PropertyName = property,
                    OldValue = oldVal,
                    NewValue = newVal
                }
            }
        };
    }

    [Fact]
    public void SearchAnomalies_BackAndForth_ShouldDetect()
    {
        var service = new HistoryService(Mock.Of<IEntityChangeSetRepository>());
        var t = DateTime.UtcNow;
        var records = new List<EntityChangeSet>
        {
            CreateRecord(t, "Status", "A", "B"),
            CreateRecord(t.AddSeconds(2), "Status", "B", "A")
        };
        var result = service.SearchAnomalies(records);
        Assert.Single(result);
        Assert.Equal("туда-обратно", result[0].Type);
    }

    [Fact]
    public void SearchAnomalies_HighFrequency_ShouldDetect()
    {
        var service = new HistoryService(Mock.Of<IEntityChangeSetRepository>());
        var t = DateTime.UtcNow;
        var records = new List<EntityChangeSet>
        {
            CreateRecord(t, "Status", "A", "B"),
            CreateRecord(t.AddSeconds(2), "Status", "B", "C")
        };
        var result = service.SearchAnomalies(records);
        Assert.Single(result);
        Assert.Equal("высокая частота", result[0].Type);
    }

    [Fact]
    public void SearchAnomalies_NoAnomalies_WhenTimeGapLarge()
    {
        var service = new HistoryService(Mock.Of<IEntityChangeSetRepository>());
        var t = DateTime.UtcNow;
        var records = new List<EntityChangeSet>
        {
            CreateRecord(t, "Status", "A", "B"),
            CreateRecord(t.AddSeconds(10), "Status", "B", "A")
        };
        var result = service.SearchAnomalies(records);
        Assert.Empty(result);
    }

}
