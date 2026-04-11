using CRM.Domain.Enums;

namespace CRM.Domain.DTO;

public class DeviceDto
{
    public Guid Id { get; set; }
    public string? Comment { get; set; }
    public DeviceStatus Status { get; set; }
    public StageResult StageResult { get; set; }
    public DeviceLifecycleFlags? Checked { get; set; }
    public int DeviceTypeId { get; set; }
    public string DeviceTypeName { get; set; } = "";
}
