namespace CRM.Domain.Entities;
using CRM.Domain.Enums;
public class DeviceStatusHistory
{
    public long Id { get; set; }

    public Guid DeviceId { get; set; }
    public Device Device { get; set; } = null!;

    public DeviceStatus OldStatus { get; set; }
    public StageResult OldStageResult { get; set; }
    public DeviceStatus NewStatus { get; set; }
    public StageResult NewStageResult { get; set; }

    public DateTime ChangedAt { get; set; } = DateTime.UtcNow;
    public string? ChangedBy { get; set; }
    public string? Comment { get; set; }
}