using CRM.Domain.DTO;
using CRM.Domain.Entities;
using CRM.Domain.Enums;
using CRM.Domain.Abstractions;
using Microsoft.EntityFrameworkCore;
namespace CRM.Services;

public class BookingService
{
    private readonly IBookingRepository _bookingRepo;
    private readonly IUnitOfWork _uow;
    private readonly IEntityChangeSetRepository _historyRepo;
    private readonly ITrashRepository _trash;

    private readonly DeviceService _deviceService;


    public BookingService(
        IUnitOfWork uow,
        IBookingRepository bookingRepo,
        IEntityChangeSetRepository historyRepo,
        ITrashRepository trash,
        DeviceService deviceService)
    {
        _uow = uow;
        _bookingRepo = bookingRepo;
        _historyRepo = historyRepo;
        _deviceService = deviceService;
        _trash = trash;
    }
    public async Task<(List<BookDTO> Items, int Total)> GetBooksPaged(
        int skip, int take, string? sort, string? order, string? searchTerm)
    {
        var query = _bookingRepo.Query().AsNoTracking();

        query = query.Where(d => d.Status != BookingStatus.Deleted);

        // Search
        if (!string.IsNullOrEmpty(searchTerm))
        {
            query = query.Where(d =>
                d.Comment.Contains(searchTerm) ||
                d.DeviceTypeId.ToString().Contains(searchTerm) ||
                d.Id.ToString().Contains(searchTerm) ||
                d.NumberOfDevices.ToString().Contains(searchTerm));
        }

        // Total count before paging
        int total = await query.CountAsync();

        // Sorting
        query = sort?.ToLower() switch
        {
            "numberofdevices" => order?.ToLower() == "desc"
                ? query.OrderByDescending(d => d.NumberOfDevices).ThenBy(d => d.Id)
                : query.OrderBy(d => d.NumberOfDevices).ThenBy(d => d.Id),
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
            .Select(d => new BookDTO
            {
                Id = d.Id,
                Comment = d.Comment,
                Status = d.Status,
                DeviceTypeId = d.DeviceTypeId,
                DeviceTypeName = d.DeviceType.Name,
                NumberOfDevices = d.NumberOfDevices,
                CompletedAt = d.CompletedAt,
                CreatedAt = d.CreatedAt,
            })
            .ToListAsync();

        return (items, total);
    }

    public async Task RegisterBookingAsync(Booking booking, string? user)
    {
        await _uow.BeginTransactionAsync();
        try
        {

            // 1. Save booking
            await _bookingRepo.AddAsync(booking);

            // 2. Create devices
            var devicesToCreate = Enumerable.Range(0, booking.NumberOfDevices)
               .Select(_ => new Device
               {
                   Id = Guid.NewGuid(),
                   DeviceTypeId = booking.DeviceTypeId,
                   BookingId = booking.Id,
                   Checked = DeviceLifecycleFlags.None,
                   Status = DeviceStatus.None,
                   StageResult = StageResult.None,
                   CreatedAt = DateTime.UtcNow
               }).ToList();

            // 3. Delegate saving & history to DeviceService
            var createdDevices = await _deviceService.RegisterDevicesWithHistory(devicesToCreate, user);

            var bookingChangeSet = new EntityChangeSet
            {
                EntityName = nameof(Booking),
                EntityId = booking.Id.ToString(),
                Operation = ChangeOperation.Create,
                ChangedBy = user,
                Comment = $"Booking created with {createdDevices.Count} devices"
            };
            bookingChangeSet.Changes.Add(new EntityChange
            {
                PropertyName = nameof(Booking.NumberOfDevices),
                OldValue = null,
                NewValue = booking.NumberOfDevices.ToString()
            });

            await _historyRepo.AddAsync(bookingChangeSet);
            await _uow.SaveChangesAsync();
            await _uow.CommitAsync();
        }
        catch
        {
            await _uow.RollbackAsync();
            throw;
        }
    }
    public async Task SoftDelete(int bookId, string? user, string? reason = null)
    {
        await _uow.BeginTransactionAsync();
        try
        {
            var booking = await _bookingRepo.GetByIdAsync(bookId)
                     ?? throw new InvalidOperationException("Device not found");

            // 2. Store old status for history
            var oldStatus = booking.Status;

            // 3. Mark book as deleted
            booking.Status = BookingStatus.Deleted;

            // 4. Add entity change set
            var changeSet = new EntityChangeSet
            {
                EntityName = "Booking",
                EntityId = booking.Id.ToString(),
                Operation = ChangeOperation.Delete,
                ChangedBy = user,
                Comment = reason ?? "Device soft deleted"
            };
            changeSet.Changes.Add(new EntityChange
            {
                PropertyName = "Status",
                OldValue = oldStatus.ToString(),
                NewValue = booking.Status.ToString()
            });

            await _historyRepo.AddAsync(changeSet);

            //AddTrashBinElement
            var trashBinElement = new TrashBinElement
            {
                EntityName = "Booking",
                EntityKey = booking.Id.ToString(),
                PreviousStatus = oldStatus.ToString(),
                DeletedAt = DateTime.UtcNow,
                ExpiresAt = DateTime.UtcNow.AddDays(30),
                DeletedBy = user,
                Reason = reason,
            };

            await _trash.AddAsync(trashBinElement);

            // 6. Update book
            await _bookingRepo.UpdateAsync(booking);
            await _uow.SaveChangesAsync();
            await _uow.CommitAsync();
        }
        catch
        {
            await _uow.RollbackAsync();
            throw;
        }
    }
}