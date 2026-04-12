using CRM.Domain.DTO;
using CRM.Domain.Enums;
using CRM.Domain.Abstractions;
using Microsoft.EntityFrameworkCore;
using CRM.Domain.Entities;

namespace CRM.Services
{
    public class DashBoardService
    {
        private readonly IBookingRepository _bookingRepo;
        private readonly IEntityChangeSetRepository _historyRepo;
        private readonly IDeviceRepository _deviceRepo;
        private readonly IDeviceTypeRepository _deviceTypeRepo;
        private readonly IDeviceStatusHistoryRepository _deviceStatusHistory;
        private readonly ITrashRepository _trash;

        public DashBoardService(
            IBookingRepository bookingRepo,
            IEntityChangeSetRepository historyRepo,
            IDeviceTypeRepository deviceTypeRepo,
            IDeviceStatusHistoryRepository deviceStatusHistory,
            ITrashRepository trash,
            IDeviceRepository deviceRepo)
        {
            _deviceStatusHistory = deviceStatusHistory;
            _deviceTypeRepo = deviceTypeRepo;
            _bookingRepo = bookingRepo;
            _historyRepo = historyRepo;
            _deviceRepo = deviceRepo;
            _trash = trash;
        }

        public async Task<DashboardDto> GetDashboardData()
        {

            var totalDevices = await _deviceRepo.Query().CountAsync(b => b.Status != DeviceStatus.Deleted);
            var totalBookings = await _bookingRepo.Query().CountAsync(b => b.Status != BookingStatus.Deleted);
            var deletedBookings = await _bookingRepo.Query().CountAsync(b => b.Status == BookingStatus.Deleted);
            var totalDeviceTypes = await _deviceTypeRepo.Query().CountAsync();
            var totalTests = await _deviceStatusHistory.Query().Where(h => h.NewStatus == DeviceStatus.Testing).CountAsync();
            var totalDeleted = await _trash.Query().CountAsync();

            var devicesByType = await _deviceRepo.Query()
                .GroupBy(d => d.DeviceType.Name)
                .Select(g => new NameCountDto
                {
                    Name = g.Key,
                    Count = g.Count()
                })
                .ToListAsync();

            // --- Bookings by type ---
            var bookingsByType = await _bookingRepo.Query()
                .Where(b => b.Status != BookingStatus.Deleted)
                .GroupBy(b => b.DeviceType.Name)
                .Select(g => new NameCountDto
                {
                    Name = g.Key,
                    Count = g.Count()
                })
                .ToListAsync();

            // --- Deleted by entity ---
            var deletedByEntity = await _trash.Query()
                .GroupBy(t => t.EntityName)
                .Select(g => new NameCountDto
                {
                    Name = g.Key,
                    Count = g.Count()
                })
                .ToListAsync();

            // --- Return dashboard DTO ---
            return new DashboardDto
            {
                TotalDevices = totalDevices,
                TotalBookings = totalBookings,
                TotalDeviceTypes = totalDeviceTypes,
                TotalTests = totalTests,
                TotalDeleted = totalDeleted,
                DevicesByType = devicesByType,
                BookingsByType = bookingsByType,
                DeletedByEntity = deletedByEntity
            };
        }
    }
}
