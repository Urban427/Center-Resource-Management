using CRM.Domain.Abstractions;
using CRM.Domain.Entities;
using CRM.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace CRM.Services;

public class TrashService
{
    private readonly ITrashRepository _trash;
    private readonly IDeviceRepository _device;
    private readonly IDeviceTypeRepository _deviceType;
    private readonly IBookingRepository _booking;
    private readonly IEntityChangeSetRepository _history;
    private readonly IEntityTypeRegistry _typeRegistry;
    private readonly IUnitOfWork _uow;

    public TrashService(
        ITrashRepository trash,
        IDeviceRepository device,
        IDeviceTypeRepository deviceType,
        IBookingRepository booking,
        IEntityChangeSetRepository history,
        IUnitOfWork uow,
        IEntityTypeRegistry typeRegistry)
    {
        _trash = trash;
        _device = device;
        _deviceType = deviceType;
        _booking = booking;
        _history = history;
        _uow = uow;
        _typeRegistry = typeRegistry;
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
        if (trash == null) throw new Exception("Trash item not found");

        var clrType = _typeRegistry.GetClrType(trash.EntityName);
        var keyType = _typeRegistry.GetPrimaryKeyType(clrType);

        object keyValue = keyType == typeof(Guid)
            ? Guid.Parse(trash.EntityKey)
            : Convert.ChangeType(trash.EntityKey, keyType);

        var entity = await _trash.FindEntityAsync(clrType, keyValue)
            ?? throw new Exception("Entity not found");

        // Restore Status
        var statusProp = clrType.GetProperty("Status")
            ?? throw new Exception("Entity has no Status property");

        object restoredStatus = 0;
        if (trash.PreviousStatus != null && trash.PreviousStatus.Length > 0)
        {
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
        await _uow.SaveChangesAsync();
    }

    public async Task<(List<TrashBinElement> Items, int Total)> GetTrashPaged(
        int skip, int take, string? sort, string? order, string? searchTerm)
    {
        var query = _trash.Query().AsNoTracking();

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
