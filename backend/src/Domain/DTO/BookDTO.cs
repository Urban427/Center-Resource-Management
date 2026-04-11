using CRM.Domain.Enums;

namespace CRM.Domain.DTO;

public class BookDTO
{
    public int Id { get; set; }
    public int DeviceTypeId { get; set; }
    public string? DeviceTypeName { get; set; }
    public int NumberOfDevices { get; set; }
    public string? Comment { get; set; }
    public BookingStatus Status { get; set; } = BookingStatus.Created;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? CompletedAt { get; set; }
}
