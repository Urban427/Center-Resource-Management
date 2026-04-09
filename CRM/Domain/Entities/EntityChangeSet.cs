using CRM.Domain.Enums;
namespace CRM.Domain.Entities;

public class EntityChangeSet
{
    public long Id { get; set; }

    public string EntityName { get; set; } = null!;
    public string EntityId { get; set; } = null!;
    public ChangeOperation Operation { get; set; }
    public DateTime ChangedAt { get; set; } = DateTime.UtcNow;
    public string? ChangedBy { get; set; }
    public string? Comment { get; set; }

    public ICollection<EntityChange> Changes { get; set; }
        = new List<EntityChange>();
}
