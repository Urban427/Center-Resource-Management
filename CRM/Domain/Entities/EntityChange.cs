namespace CRM.Domain.Entities;

public class EntityChange
{
    public long Id { get; set; }

    public long ChangeSetId { get; set; }
    public string PropertyName { get; set; } = null!;
    public string? OldValue { get; set; }
    public string? NewValue { get; set; }
}
