using CRM.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Domain.Abstractions;

public interface IDeviceStatusHistoryRepository
{
    public Task AddAsync(DeviceStatusHistory history);
    public Task AddRangeAsync(List<DeviceStatusHistory> histories);
    public Task<List<DeviceStatusHistory>> GetByDeviceIdAsync(Guid deviceId);
    IQueryable<DeviceStatusHistory> Query();
}
