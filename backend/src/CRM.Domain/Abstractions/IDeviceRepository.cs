using CRM.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Domain.Abstractions;
public  interface IDeviceRepository
{
    Task UpdateAsync(Device device);
    Task AddAsync(Device device);
    Task AddRangeAsync(List<Device> devices);
    Task<List<Device>> GetRangeAsync(int skip, int take);
    Task<Device?> GetByIdAsync(Guid id);
    IQueryable<Device> Query();
}
