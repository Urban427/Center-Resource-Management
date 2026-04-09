namespace CRM.Domain.Entities;

public class TrashBinElement
{
    public int Id { get; set; }
    public string EntityName { get; set; } = null!;
    public string EntityKey { get; set; } = null!;
    public string PreviousStatus { get; set; } = null!;
    public DateTime DeletedAt { get; set; } = DateTime.UtcNow;
    public DateTime ExpiresAt { get; set; }
    public string? DeletedBy { get; set; }
    public string? Reason { get; set; }
}
