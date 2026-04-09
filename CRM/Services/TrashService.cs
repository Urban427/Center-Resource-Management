using CRM.Domain.Entities;
using CRM.Domain.Enums;
using CRM.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

namespace CRM.Services;

public class TrashService
{
    private readonly TrashRepository _trash;
    private readonly DeviceRepository _device;
    private readonly DeviceTypeRepository _deviceType;
    private readonly BookingRepository _booking;
    private readonly EntityChangeSetRepository _history;

    public TrashService(
        TrashRepository trash,
        DeviceRepository device,
        DeviceTypeRepository deviceType,
        BookingRepository booking,
        EntityChangeSetRepository history)
    {
        _trash = trash;
        _device = device;
        _deviceType = deviceType;
        _booking = booking;
        _history = history;
    }
    public async Task<List<TrashBinElement>> GetRange(int from, int to)
    {
        if (from < 0 || to <= from) throw new ArgumentException("Invalid range");
        int count = to - from;
        return await _trash.GetRangeAsync(from, count);
    }
    public async Task RestoreAsync(int trashId, string user)
    {
        var trash = await _trash.GetByIdAsync(trashId);
        if(trash == null)   throw new Exception("Trash item not found");

        var entityType = _trash.Context.Model
            .GetEntityTypes()
            .FirstOrDefault(e => e.ClrType.Name == trash.EntityName);

        if (entityType == null)
            throw new Exception($"Unknown entity type {trash.EntityName}");

        var keyProperty = entityType.FindPrimaryKey()!.Properties.Single();
        var clrType = entityType.ClrType;
        object keyValue;

        if (keyProperty.ClrType == typeof(Guid)) {
            keyValue = Guid.Parse(trash.EntityKey);
        }
        else {
            keyValue = Convert.ChangeType(trash.EntityKey, keyProperty.ClrType);
        }

        var entity = await _trash.Context.FindAsync(clrType, keyValue);
        if (entity == null) new Exception("Entity not found");

        // Restore Status
        var statusProp = clrType.GetProperty("Status")
            ?? throw new Exception("Entity has no Status property");

        object restoredStatus = 0;
        if (trash.PreviousStatus != null && trash.PreviousStatus.Length > 0) {
            restoredStatus = Enum.Parse(
                statusProp.PropertyType,
                trash.PreviousStatus!
            );
        }

        statusProp.SetValue(entity, restoredStatus);

        // UpdatedAt (optional)
        clrType.GetProperty("UpdatedAt")?.SetValue(entity, DateTime.UtcNow);

        // History (generic)
        await _history.AddAsync(new EntityChangeSet
        {
            EntityName = trash.EntityName,
            EntityId = trash.EntityKey,
            Operation = ChangeOperation.Restore,
            ChangedBy = user,
            Comment = "Restored from trash"
        });

        await _trash.RemoveAsync(trash);
        await _trash.Context.SaveChangesAsync();
        await _history.Context.SaveChangesAsync();
    }

    public async Task<(List<TrashBinElement> Items, int Total)> GetTrashPaged(
        int skip, int take, string? sort, string? order, string? searchTerm)
    {
        var query = _trash.Context.TrashBinElements.AsQueryable();

        // Search
        if (!string.IsNullOrEmpty(searchTerm))
        {
            query = query.Where(d =>
                d.Reason.Contains(searchTerm) ||
                d.EntityKey.Contains(searchTerm) ||
                d.EntityName.Contains(searchTerm) ||
                d.DeletedBy.Contains(searchTerm) ||
                d.Id.ToString().Contains(searchTerm) ||
                d.DeletedAt.ToString().Contains(searchTerm));
        }

        // Total count before paging
        int total = await query.CountAsync();

        // Sorting
        query = sort?.ToLower() switch
        {
            "deletedby" => order?.ToLower() == "desc"
                ? query.OrderByDescending(d => d.DeletedBy).ThenBy(d => d.Id)
                : query.OrderBy(d => d.DeletedBy).ThenBy(d => d.Id),
            "date" => order?.ToLower() == "desc"
                ? query.OrderByDescending(d => d.ExpiresAt).ThenBy(d => d.Id)
                : query.OrderBy(d => d.ExpiresAt).ThenBy(d => d.Id),
            "entityid" => order?.ToLower() == "desc"
                ? query.OrderByDescending(d => d.EntityKey).ThenBy(d => d.Id)
                : query.OrderBy(d => d.EntityKey).ThenBy(d => d.Id),
            "entitytype" => order?.ToLower() == "desc"
                ? query.OrderByDescending(d => d.EntityName).ThenBy(d => d.Id)
                : query.OrderBy(d => d.EntityName).ThenBy(d => d.Id),
            "id" => order?.ToLower() == "desc"
                ? query.OrderByDescending(d => d.Id)
                : query.OrderBy(d => d.Id),
            _ => query.OrderBy(d => d.Id)
        };


        // Pagination
        var items = await query.Skip(skip).Take(take).ToListAsync();

        return (items, total);
    }
}
