using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CRM.Domain.Entities;
using CRM.Domain.Enums;

namespace CRM.Domain.Abstractions;

public interface IDeviceTypeRepository
{
    public Task AddAsync(DeviceType deviceType);
    public Task<List<DeviceType>> GetRangeAsync(int skip, int take);
    public Task UpdateAsync(DeviceType deviceType);
    public Task<DeviceType?> GetByIdAsync(int id);
    public Task<List<DeviceType>> SearchByNameAsync(string search);
    public Task<List<DeviceType>> GetEntitiesByNameAsync(string name, int limit = 10);
    IQueryable<DeviceType> Query();
}
