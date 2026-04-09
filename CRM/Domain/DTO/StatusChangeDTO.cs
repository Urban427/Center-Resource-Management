namespace CRM.Domain.DTO;
using CRM.Domain.Enums;
using System.ComponentModel;

public class StatusChangeDTO
{
    public long Id { get; set; }

    public Guid DeviceId { get; set; }
    public string? DeviceTypeName { get; set; }
    public DeviceLifecycleFlags newChecked { get; set; }

    public DeviceStatus OldStatus { get; set; }
    public StageResult OldStageResult { get; set; }
    public DeviceStatus NewStatus { get; set; }
    public StageResult NewStageResult { get; set; }

    public DateTime ChangedAt { get; set; }
    public string? ChangedBy { get; set; }
    public string? Comment { get; set; }
}