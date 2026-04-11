namespace CRM.Domain.Entities;
using CRM.Domain.Enums;
public class Booking
{
    public int Id { get; set; }
    public int DeviceTypeId { get; set; }
    public DeviceType? DeviceType { get; set; }
    public int NumberOfDevices { get; set; }
    public string? Comment { get; set; }
    public BookingStatus Status { get; set; } = BookingStatus.Created;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? CompletedAt { get; set; }
}
