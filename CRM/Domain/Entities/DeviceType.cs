namespace CRM.Domain.Entities;
using CRM.Domain.Enums;
public class DeviceType
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Comment { get; set; }
    public DeviceTypeStatus Status { get; set; }
    public ICollection<Device> Devices { get; set; } = new List<Device>();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
