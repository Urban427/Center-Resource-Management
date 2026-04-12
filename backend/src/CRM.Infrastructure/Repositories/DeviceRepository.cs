namespace CRM.Infrastructure.Repositories;
using CRM.Domain.Entities;
using CRM.Domain.Enums;
using CRM.Domain.Abstractions;
using CRM.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
public class DeviceRepository : RepositoryBase, IDeviceRepository
{
    public DeviceRepository(AppDbContext context) : base(context) { }

    public Task UpdateAsync(Device device)
    {
        _context.Devices.Update(device);
        return Task.CompletedTask;
    }

    public Task AddAsync(Device device)
    {
        _context.Devices.Add(device);
        return Task.CompletedTask;
    }
    public Task AddRangeAsync(List<Device> device)
    {
        _context.Devices.AddRange(device);
        return Task.CompletedTask;
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
    public IQueryable<Device> Query()
    {
        return _context.Devices.AsQueryable();
    }
}
