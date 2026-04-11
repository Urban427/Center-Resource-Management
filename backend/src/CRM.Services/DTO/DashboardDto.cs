namespace CRM.Domain.DTO;
public class DashboardDto
{
    public int TotalDevices { get; set; }
    public int TotalBookings { get; set; }
    public int TotalDeviceTypes { get; set; }
    public int TotalTests { get; set; }
    public int TotalDeleted { get; set; }


    public List<NameCountDto> DevicesByType { get; set; } = new();
    public List<NameCountDto> BookingsByType { get; set; } = new();
    public List<NameCountDto> DeletedByEntity { get; set; } = new();
}

public class NameCountDto
{
    public string Name { get; set; } = null!;
    public int Count { get; set; }
}