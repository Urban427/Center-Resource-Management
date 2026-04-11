using CRM.Domain.DTO;
using CRM.Domain.Enums;
using CRM.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

namespace CRM.Services
{
    public class DashBoardService
    {
        private readonly BookingRepository _bookingRepo;
        private readonly EntityChangeSetRepository _historyRepo;
        private readonly DeviceRepository _deviceRepo;
        private readonly TrashRepository _trash;

        public DashBoardService(
            BookingRepository bookingRepo,
            EntityChangeSetRepository historyRepo,
            TrashRepository trash,
            DeviceRepository deviceRepo)
        {
            _bookingRepo = bookingRepo;
            _historyRepo = historyRepo;
            _deviceRepo = deviceRepo;
            _trash = trash;
        }

        public async Task<DashboardDto> GetDashboardData()
        {
            // --- Get all devices ---
            var totalDevices = await _deviceRepo.Context.Devices.CountAsync(b => b.Status != DeviceStatus.Deleted);

            // --- Get all bookings ---
            var totalBookings = await _bookingRepo.Context.Bookings.CountAsync(b => b.Status != BookingStatus.Deleted);

            // --- Get deleted bookings count ---
            var deletedBookings = await _bookingRepo.Context.Bookings.CountAsync(b => b.Status == BookingStatus.Deleted);

            // --- Get total device types ---
            var totalDeviceTypes = await _bookingRepo.Context.DeviceTypes.CountAsync();

            // --- Get total tests ---
            var totalTests = await _historyRepo.Context.DeviceStatusHistories
                .Where(h => h.NewStatus == DeviceStatus.Testing)
                .CountAsync();

            // --- Get deleted entities ---
            var totalDeleted = await _trash.Context.TrashBinElements.CountAsync();

            // --- Devices by type ---
            var devicesByType = await _deviceRepo.Context.Devices
                .GroupBy(d => d.DeviceType.Name)
                .Select(g => new NameCountDto
                {
                    Name = g.Key,
                    Count = g.Count()
                })
                .ToListAsync();

            // --- Bookings by type ---
            var bookingsByType = await _bookingRepo.Context.Bookings
                .Where(b => b.Status != BookingStatus.Deleted)
                .GroupBy(b => b.DeviceType.Name)
                .Select(g => new NameCountDto
                {
                    Name = g.Key,
                    Count = g.Count()
                })
                .ToListAsync();

            // --- Deleted by entity ---
            var deletedByEntity = await _trash.Context.TrashBinElements
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
