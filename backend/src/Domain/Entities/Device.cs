namespace CRM.Domain.Entities;
using CRM.Domain.Enums;
public class Device
{
    public Guid Id { get; set; }
    public int DeviceTypeId { get; set; }
    public DeviceType? DeviceType { get; set; } = null!;
    public DeviceStatus Status { get; set; } = DeviceStatus.Registered;
    public DeviceLifecycleFlags? Checked { get; set; }
    public StageResult StageResult { get; set; } = StageResult.None;
    public string? Comment { get; set; }
    public int? BookingId { get; set; }
    public Booking? Booking { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
