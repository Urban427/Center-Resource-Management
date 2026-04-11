namespace CRM.Infrastructure.Repositories;
using CRM.Domain.Entities;
using CRM.Domain.Enums;
using CRM.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
public class DeviceRepository : RepositoryBase
{
    public DeviceRepository(AppDbContext context) : base(context) { }

    public async Task UpdateAsync(Device device)
    {
        _context.Devices.Update(device);
        await _context.SaveChangesAsync();
    }

    public async Task AddAsync(Device device)
    {
        _context.Devices.Add(device);
        await _context.SaveChangesAsync();
    }
    public async Task AddRangeAsync(List<Device> device)
    {
        _context.Devices.AddRange(device);
        await _context.SaveChangesAsync();
    }

    public async Task<List<Device>> GetRangeAsync(int skip, int take)
    {
        return await _context.Devices
            .Where(d => d.Status != DeviceStatus.Deleted)
            .OrderBy(d => d.Id)
            .Skip(skip)
            .Take(take)
            .ToListAsync();
    }
    public async Task<Device?> GetByIdAsync(Guid id)
    {
        return await _context.Devices
            .Include(d => d.DeviceType)
            .FirstOrDefaultAsync(d => d.Id == id);
    }
}
