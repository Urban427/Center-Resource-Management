namespace CRM.Infrastructure.Repositories;
using CRM.Domain.Entities;
using CRM.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

public class DeviceStatusHistoryRepository : RepositoryBase
{

    public DeviceStatusHistoryRepository(AppDbContext context) : base(context) { }

    public async Task AddAsync(DeviceStatusHistory history)
    {
        _context.DeviceStatusHistories.Add(history);
        await _context.SaveChangesAsync();
    }
    public async Task AddRangeAsync(List<DeviceStatusHistory> histories)
    {
        _context.DeviceStatusHistories.AddRange(histories);
        await _context.SaveChangesAsync();
    }

    public async Task<List<DeviceStatusHistory>> GetByDeviceIdAsync(Guid deviceId)
    {
        return await _context.DeviceStatusHistories
            .Where(h => h.DeviceId == deviceId)
            .OrderByDescending(h => h.ChangedAt)
            .ToListAsync();
    }

    public IQueryable<DeviceStatusHistory> Query()
    {
        return _context.DeviceStatusHistories.AsQueryable();
    }
}
