namespace CRM.Services;
using CRM.Domain.DTO;
using CRM.Domain.Entities;
using CRM.Domain.Enums;
using CRM.Domain.Abstractions;
using Microsoft.EntityFrameworkCore;

public class DeviceTestingService
{
    private readonly IDeviceRepository _devices;
    private readonly IDeviceStatusHistoryRepository _history;
    private readonly DeviceService _devicesSer;


    public DeviceTestingService(
        IDeviceRepository devices,
        IDeviceStatusHistoryRepository history,
        DeviceService devicesSer)
    {
        _devices = devices;
        _history = history;

        _devicesSer = devicesSer;
    }

    public async Task<StatusChangeDTO> RecordStatusChange(
        Guid deviceId,
        DeviceStatus status,
        StageResult result,
        string? comment,
        string? changedBy = null)
    {
        var device = await _devices.GetByIdAsync(deviceId)
            ?? throw new InvalidOperationException("Device not found");

        var statusHistory = await _devicesSer.ApplyStatusChange(device, status, result, comment, changedBy);
        return statusHistory;
    }

    public async Task<IEnumerable<DeviceStatusHistory>> GetTests(
        int skip = 0,
        int take = 100,
        StageResult? result = null,
        DateTime? from = null,
        DateTime? to = null)
    {
        var query = _history.Query()
            .Where(h => h.NewStatus == DeviceStatus.Testing);

        if (result != null)
            query = query.Where(h => h.NewStageResult == result);

        if (from != null)
            query = query.Where(h => h.ChangedAt >= from);

        if (to != null)
            query = query.Where(h => h.ChangedAt <= to);

        // ordering first, then skip/take for paging
        return await query
            .OrderByDescending(h => h.ChangedAt)
            .Skip(skip)
            .Take(take)
            .ToListAsync();
    }

    public async Task<(List<StatusChangeDTO> Items, int Total)> GetTestsPaged(
        int skip, int take, string? sort, string? order, string? searchTerm)
    {
        var query = _history.Query().AsNoTracking();

        query = _history.Query().Where(h => h.NewStatus == DeviceStatus.Testing);
        // Search
        if (!string.IsNullOrEmpty(searchTerm))
        {
            query = query.Where(d =>
                d.Comment.Contains(searchTerm) ||
                d.DeviceId.ToString().Contains(searchTerm) ||
                d.ChangedAt.ToString().Contains(searchTerm) ||
                d.ChangedBy.Contains(searchTerm) ||
                d.Id.ToString().Contains(searchTerm));
        }

        // Total count before paging
        int total = await query.CountAsync();

        // Sorting
        query = sort?.ToLower() switch
        {
            "deviceid" => order?.ToLower() == "desc"
                ? query.OrderByDescending(d => d.DeviceId).ThenBy(d => d.Id)
                : query.OrderBy(d => d.DeviceId).ThenBy(d => d.Id),
            "changedat" => order?.ToLower() == "desc"
                ? query.OrderByDescending(d => d.ChangedAt).ThenBy(d => d.Id)
                : query.OrderBy(d => d.ChangedAt).ThenBy(d => d.Id),
            "changedby" => order?.ToLower() == "desc"
                ? query.OrderByDescending(d => d.ChangedBy).ThenBy(d => d.Id)
                : query.OrderBy(d => d.ChangedBy).ThenBy(d => d.Id),
            //"type" => order?.ToLower() == "desc"
            //    ? query.OrderByDescending(d => d.DeviceTypeId).ThenBy(d => d.Id)
            //    : query.OrderBy(d => d.DeviceTypeId).ThenBy(d => d.Id),
            "id" => order?.ToLower() == "desc"
                ? query.OrderByDescending(d => d.Id)
                : query.OrderBy(d => d.Id),
            _ => query.OrderBy(d => d.Id)
        };


        // Pagination
        var items = await query
            .Skip(skip)
            .Take(take)
            .Select(d => new StatusChangeDTO
            {
                Id = d.Id,
                DeviceId = d.DeviceId,
                DeviceTypeName = d.Device.DeviceType.Name,
                OldStatus = d.OldStatus,
                OldStageResult = d.OldStageResult,
                NewStatus = d.NewStatus,
                NewStageResult = d.NewStageResult,
                ChangedAt = d.ChangedAt,
                ChangedBy = d.ChangedBy,
                Comment = d.Comment
            })
            .ToListAsync();

        return (items, total);
    }

}
