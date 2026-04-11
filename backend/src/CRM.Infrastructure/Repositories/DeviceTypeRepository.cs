namespace CRM.Infrastructure.Repositories;
using CRM.Domain.Entities;
using CRM.Domain.Enums;
using CRM.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
public class DeviceTypeRepository : RepositoryBase
{
    public DeviceTypeRepository(AppDbContext context) : base(context) { }

    public async Task AddAsync(DeviceType deviceType)
    {
        _context.DeviceTypes.Add(deviceType);
        await _context.SaveChangesAsync();
    }

    public async Task<List<DeviceType>> GetRangeAsync(int skip, int take)
    {
        return await _context.DeviceTypes
            .Where(d => d.Status != DeviceTypeStatus.Deleted)
            .OrderBy(d => d.Id)
            .Skip(skip)
            .Take(take)
            .ToListAsync();
    }
    public async Task UpdateAsync(DeviceType deviceType)
    {
        _context.DeviceTypes.Update(deviceType);
        await _context.SaveChangesAsync();
    }
    public async Task<DeviceType?> GetByIdAsync(int id)
    {
        return await _context.DeviceTypes
            .FirstOrDefaultAsync(d => d.Id == id && d.Status != DeviceTypeStatus.Deleted);
    }
    public async Task<List<DeviceType>> SearchByNameAsync(string search)
    {
        return await _context.DeviceTypes
            .Where(d => EF.Functions.ILike(d.Name, $"%{search}%"))
            .ToListAsync();
    }
    public async Task<List<DeviceType>> GetEntitiesByNameAsync(string name, int limit = 10)
    {
        return await _context.DeviceTypes
            .Where(d => EF.Functions.ILike(d.Name, $"%{name}%") && d.Status != DeviceTypeStatus.Deleted)
            .OrderBy(d => d.Id)
            .Take(limit)
            .ToListAsync();
    }
}