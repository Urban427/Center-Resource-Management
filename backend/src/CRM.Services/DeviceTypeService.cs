namespace CRM.Services;
using CRM.Domain.Entities;
using CRM.Domain.Enums;
using CRM.Domain.Abstractions;
using Microsoft.EntityFrameworkCore;

public class DeviceTypeService
{
    private readonly IDeviceTypeRepository _deviceTypes;
    private readonly ITrashRepository _trash;
    private readonly IEntityChangeSetRepository _history;
    private readonly IUnitOfWork _uow;

    public DeviceTypeService(
        IDeviceTypeRepository deviceTypes,
        IEntityChangeSetRepository history,
        IUnitOfWork uow,
        ITrashRepository trash)
    {
        _uow = uow;
        _deviceTypes = deviceTypes;
        _trash = trash;
        _history = history;
    }

    // Create device type and save changeset
    public async Task RegisterDeviceType(DeviceType deviceType, string changedBy)
    {
        await _deviceTypes.AddAsync(deviceType);

        var changeSet = new EntityChangeSet
        {
            EntityName = nameof(DeviceType),
            EntityId = deviceType.Id.ToString(),
            Operation = ChangeOperation.Create,
            ChangedBy = changedBy,
            Changes = typeof(DeviceType).GetProperties()
                .Select(p => new EntityChange
                {
                    PropertyName = p.Name,
                    OldValue = null,
                    NewValue = p.GetValue(deviceType)?.ToString()
                })
                .ToList()
        };

        await _history.AddAsync(changeSet);
        await _uow.SaveChangesAsync();
    }

    // Update device type and save changeset
    public async Task UpdateDeviceType(DeviceType updatedDeviceType, string? changedBy = null)
    {
        var existingDeviceType = await _deviceTypes.GetByIdAsync(updatedDeviceType.Id);
        if (existingDeviceType == null)
            throw new Exception("Device type not found");

        var changes = new List<EntityChange>();

        foreach (var prop in typeof(DeviceType).GetProperties())
        {
            var oldValue = prop.GetValue(existingDeviceType)?.ToString();
            var newValue = prop.GetValue(updatedDeviceType)?.ToString();

            if (oldValue != newValue)
            {
                changes.Add(new EntityChange
                {
                    PropertyName = prop.Name,
                    OldValue = oldValue,
                    NewValue = newValue
                });

                // Apply change
                prop.SetValue(existingDeviceType, prop.GetValue(updatedDeviceType));
            }
        }

        if (changes.Any())
        {
            var changeSet = new EntityChangeSet
            {
                EntityName = nameof(DeviceType),
                EntityId = updatedDeviceType.Id.ToString(),
                Operation = ChangeOperation.Update,
                ChangedBy = changedBy,
                Changes = changes
            };

            await _history.AddAsync(changeSet);
        }

        await _deviceTypes.UpdateAsync(existingDeviceType);
        await _uow.SaveChangesAsync();
    }

    public async Task<(List<DeviceType> Items, int Total)> GetDeviceTypesPaged(
    int skip, int take, string? sort, string? order, string? searchTerm)
    {
        var query = _deviceTypes.Query().AsNoTracking();

        query = query.Where(d => d.Status != DeviceTypeStatus.Deleted);
        // Apply search
        if (!string.IsNullOrEmpty(searchTerm))
        {
            query = query.Where(d =>
                d.Name.Contains(searchTerm) ||
                d.Comment.Contains(searchTerm)
            );
        }

        int total = await query.CountAsync();

        query = (sort?.ToLower(), order?.ToLower()) switch
        {
            ("type", "desc") => query.OrderByDescending(d => d.Name),
            ("type", _) => query.OrderBy(d => d.Name),
            ("description", "desc") => query.OrderByDescending(d => d.Comment),
            ("description", _) => query.OrderBy(d => d.Comment),
            _ => order?.ToLower() == "desc" ? query.OrderByDescending(d => d.Id) : query.OrderBy(d => d.Id)
        };
        var items = await query.Skip(skip).Take(take).ToListAsync();

        return (items, total);
    }


    public async Task<List<DeviceType>> GetRange(int from, int to)
    {
        if (from < 0 || to <= from)
            throw new ArgumentException("Invalid range");

        int count = to - from;

        return await _deviceTypes.GetRangeAsync(from, count);
    }
    public async Task<List<DeviceType>> GetDeviceTypesByNamePaged(string name)
    {
        return await _deviceTypes.GetEntitiesByNameAsync(name, 10);
    }

    public async Task<List<DeviceType>> SearchDeviceTypes(string search)
    {
        return await _deviceTypes.SearchByNameAsync(search);
    }

    public async Task SoftDelete(int deviceId, string? user, string? reason = null)
    {
        // 1. Get the deviceType
        var deviceType = await _deviceTypes.GetByIdAsync(deviceId)
                     ?? throw new InvalidOperationException("Device not found");

        // 2. Store old status for history
        var oldStatus = deviceType.Status;

        // 3. Mark deviceType as deleted
        deviceType.Status = DeviceTypeStatus.Deleted;

        // 4. Add entity change set
        var changeSet = new EntityChangeSet
        {
            EntityName = "DeviceType",
            EntityId = deviceType.Id.ToString(),
            Operation = ChangeOperation.Delete,
            ChangedBy = user,
            Comment = reason ?? "Device soft deleted"
        };
        changeSet.Changes.Add(new EntityChange
        {
            PropertyName = "Status",
            OldValue = oldStatus.ToString(),
            NewValue = deviceType.Status.ToString()
        });

        await _history.AddAsync(changeSet);

        //AddTrashBinElement
        var trashBinElement = new TrashBinElement
        {
            EntityName = "DeviceType",
            EntityKey = deviceId.ToString(),
            PreviousStatus = oldStatus.ToString(),
            DeletedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddDays(30),
            DeletedBy = user,
            Reason = reason,
        };

        await _trash.AddAsync(trashBinElement);

        // 6. Update deviceType
        await _deviceTypes.UpdateAsync(deviceType);
        await _uow.SaveChangesAsync();
    }
}