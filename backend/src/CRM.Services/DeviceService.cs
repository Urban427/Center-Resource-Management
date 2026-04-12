namespace CRM.Services;
using CRM.Domain.Abstractions;
using CRM.Domain.DTO;
using CRM.Domain.Entities;
using CRM.Domain.Enums;
using Microsoft.EntityFrameworkCore;

public class DeviceService
{
    private readonly IDeviceRepository _devices;
    private readonly IUnitOfWork _uow;
    private readonly IEntityChangeSetRepository _history;
    private readonly ITrashRepository _trash;
    private readonly IDeviceStatusHistoryRepository _statusHistory;

    public DeviceService(
        IUnitOfWork uow,
        IDeviceRepository device,
        IEntityChangeSetRepository history,
        ITrashRepository trash,
        IDeviceStatusHistoryRepository statusHistory)
    {
        _uow = uow;
        _devices = device;
        _history = history;
        _trash = trash;
        _statusHistory = statusHistory;
    }

    public async Task<(List<DeviceDto> Items, int Total)> GetDevicesPaged(
        int skip, int take, string? sort, string? order, string? searchTerm)
    {
        var query = _devices.Query().AsNoTracking();

        query = query.Where(d => d.Status != DeviceStatus.Deleted);

        // Search
        if (!string.IsNullOrEmpty(searchTerm))
        {
            query = query.Where(d =>
                d.Comment.Contains(searchTerm) ||
                d.Status.ToString().Contains(searchTerm) ||
                d.StageResult.ToString().Contains(searchTerm));
        }

        // Total count before paging
        int total = await query.CountAsync();

        // Sorting
        query = sort?.ToLower() switch
        {
            "status" => order?.ToLower() == "desc"
                ? query.OrderByDescending(d => d.Status).ThenByDescending(d => d.StageResult).ThenBy(d => d.Id)
                : query.OrderBy(d => d.Status).ThenBy(d => d.StageResult).ThenBy(d => d.Id),
            "type" => order?.ToLower() == "desc"
                ? query.OrderByDescending(d => d.DeviceTypeId).ThenBy(d => d.Id)
                : query.OrderBy(d => d.DeviceTypeId).ThenBy(d => d.Id),
            "id" => order?.ToLower() == "desc"
                ? query.OrderByDescending(d => d.Id)
                : query.OrderBy(d => d.Id),
            _ => query.OrderBy(d => d.Id)
        };


        // Pagination
        var items = await query
        .Skip(skip)
        .Take(take)
        .Select(d => new DeviceDto
        {
            Id = d.Id,
            Comment = d.Comment,
            Status = d.Status,
            StageResult = d.StageResult,
            Checked = d.Checked,
            DeviceTypeId = d.DeviceTypeId,
            DeviceTypeName = d.DeviceType.Name
        })
        .ToListAsync();

        return (items, total);
    }
    public async Task<DeviceDto?> GetDeviceById(Guid id)
    {
        var device = await _devices.GetByIdAsync(id);
        if (device == null) return null;

        var dto = new DeviceDto
        {
            Id = device.Id,
            Comment = device.Comment,
            Status = device.Status,
            StageResult = device.StageResult,
            Checked = device.Checked,
            DeviceTypeId = device.DeviceTypeId,
            DeviceTypeName = device.DeviceType.Name
        };

        return dto;
    }
    public async Task<List<DeviceStatusHistory>> getStatusHistory(Guid id)
    {
        return await _statusHistory.GetByDeviceIdAsync(id);
    }

    public async Task<StatusChangeDTO> ApplyStatusChange(
        Device device,
        DeviceStatus status,
        StageResult result,
        string? comment,
        string? changedBy = null)
    {
        switch (status)
        {
            case DeviceStatus.Registered:
                break;
            case DeviceStatus.Testing:
                if ((device.Checked & DeviceLifecycleFlags.Registered) == 0)
                    throw new InvalidOperationException("Device must be Registered before Testing.");
                break;

            case DeviceStatus.VisualTesting:
                if ((device.Checked & DeviceLifecycleFlags.Registered) == 0)
                    throw new InvalidOperationException("Device must be Registered before Visual Testing.");
                break;

            case DeviceStatus.Released:
                if (!(
                    ((device.Checked & DeviceLifecycleFlags.VisualTestingDone) != 0) &&
                    ((device.Checked & DeviceLifecycleFlags.TestingDone) != 0) &&
                    ((device.Checked & DeviceLifecycleFlags.VisualTestingFailed) == 0) &&
                    ((device.Checked & DeviceLifecycleFlags.TestingFailed) == 0))
                   )
                    throw new InvalidOperationException("Cannot release device until both Testing and Visual Testing passed.");
                break;

            case DeviceStatus.InWarehouse:
                if ((device.Checked & DeviceLifecycleFlags.Released) == 0)
                    throw new InvalidOperationException("Device must be Released before moving to Warehouse.");
                break;

            case DeviceStatus.SentToCustumer:
                if ((device.Checked & DeviceLifecycleFlags.Released) == 0)
                    throw new InvalidOperationException("Device must be Released before moving to Warehouse.");
                break;

            case DeviceStatus.Deleted:
                // always allowed
                break;

            default:
                throw new InvalidOperationException("Unknown stage");
        }
        DeviceLifecycleFlags newChecks = (device.Checked ?? DeviceLifecycleFlags.None) | (DeviceLifecycleFlags)(1 << (int)status);

        switch (status)
        {
            case DeviceStatus.Testing:
                if (result == StageResult.Failed)
                    newChecks |= DeviceLifecycleFlags.TestingFailed;
                else if (result == StageResult.Passed)
                    newChecks &= ~DeviceLifecycleFlags.TestingFailed;
                break;

            case DeviceStatus.VisualTesting:
                if (result == StageResult.Failed)
                    newChecks |= DeviceLifecycleFlags.VisualTestingFailed;
                else if (result == StageResult.Passed)
                    newChecks &= ~DeviceLifecycleFlags.VisualTestingFailed;
                break;
        }

        var history = new DeviceStatusHistory
        {
            DeviceId = device.Id,
            OldStatus = device.Status,
            OldStageResult = device.StageResult,
            NewStatus = status,
            NewStageResult = result,
            ChangedBy = changedBy,
            Comment = comment
        };

        device.StageResult = result;
        device.Status = status;
        device.Checked = newChecks;

        await _statusHistory.AddAsync(history);
        await _devices.UpdateAsync(device);
        return new StatusChangeDTO
        {
            DeviceId = history.DeviceId,
            newChecked = newChecks,
            OldStatus = history.OldStatus,
            OldStageResult = history.OldStageResult,
            NewStatus = history.NewStatus,
            NewStageResult = history.NewStageResult,
            ChangedBy = history.ChangedBy,
            Comment = history.Comment,
        };
    }
    public async Task RegisterDevice(Device device, string? user)
    {
        //update
        if (device.Id != Guid.Empty)
        {
            return;
        }
        // Save device
        device.Checked = DeviceLifecycleFlags.None;
        device.Status = DeviceStatus.None;
        await _devices.AddAsync(device);

        // Save EntityChangeSet for device
        var changeSet = new EntityChangeSet
        {
            EntityName = "Device",
            EntityId = device.Id.ToString(),
            Operation = ChangeOperation.Create,
            ChangedBy = user,
            Comment = "Device registered"
        };
        changeSet.Changes.Add(new EntityChange
        {
            PropertyName = "Status",
            OldValue = null,
            NewValue = "Registered"
        });

        await _history.AddAsync(changeSet);
        await _uow.SaveChangesAsync();
    }

    public async Task<List<Device>> RegisterDevicesWithHistory(List<Device> devices, string? user)
    {
        await _uow.BeginTransactionAsync();
        try
        {
            foreach (var device in devices)
            {
                // Save device
                await _devices.AddAsync(device);

                // Status history
                var statusHistory = new DeviceStatusHistory
                {
                    DeviceId = device.Id,
                    OldStatus = DeviceStatus.Registered,
                    OldStageResult = StageResult.None,
                    NewStatus = DeviceStatus.Registered,
                    NewStageResult = StageResult.None,
                    ChangedAt = DateTime.UtcNow,
                    ChangedBy = user,
                    Comment = "Device created"
                };
                await _statusHistory.AddAsync(statusHistory);

                // Entity change set
                var changeSet = new EntityChangeSet
                {
                    EntityName = "Device",
                    EntityId = device.Id.ToString(),
                    Operation = ChangeOperation.Create,
                    ChangedBy = user,
                    Comment = "Device registered"
                };
                changeSet.Changes.Add(new EntityChange
                {
                    PropertyName = "Status",
                    OldValue = null,
                    NewValue = "Registered"
                });
                await _history.AddAsync(changeSet);
            }

            await _uow.SaveChangesAsync();
        }
        catch
        {
            await _uow.RollbackAsync();
            throw;
        }
        return devices;
    }
    public async Task SoftDelete(Guid deviceId, string? user, string? reason = null)
    {
        // 1. Get the device
        var device = await _devices.GetByIdAsync(deviceId) ?? throw new InvalidOperationException("Device not found");

        // 2. Store old status for history
        var oldStatus = device.Status;
        var oldStage = device.StageResult;

        // 3. Mark device as deleted
        device.Status = DeviceStatus.Deleted;
        device.UpdatedAt = DateTime.UtcNow;

        // 4. Add entity change set
        var changeSet = new EntityChangeSet
        {
            EntityName = "Device",
            EntityId = device.Id.ToString(),
            Operation = ChangeOperation.Delete,
            ChangedBy = user,
            Comment = reason ?? "Device soft deleted"
        };
        changeSet.Changes.Add(new EntityChange
        {
            PropertyName = "Status",
            OldValue = oldStatus.ToString(),
            NewValue = device.Status.ToString()
        });

        await _history.AddAsync(changeSet);

        //AddTrashBinElement
        var trashBinElement = new TrashBinElement
        {
            EntityName = "Device",
            EntityKey = deviceId.ToString(),
            PreviousStatus = oldStatus.ToString(),
            DeletedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddDays(30),
            DeletedBy = user,
            Reason = reason,
        };

        await _trash.AddAsync(trashBinElement);
        await _devices.UpdateAsync(device);
        await _uow.SaveChangesAsync();
    }
}