using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Domain.Entities;

public class HistoryAnomaly
{
    public string EntityName { get; set; } = null!;
    public string EntityId { get; set; } = null!;
    public string Type { get; set; } = null!;
    public DateTime DetectedAt { get; set; }
    public List<EntityChangeSet> RelatedChanges { get; set; } = new();
}
