using Moq;
using Xunit;
using CRM.Services;
using CRM.Domain.Entities;
using CRM.Domain.Enums;
using CRM.Infrastructure.Repositories;

namespace CRM.Tests;

public class DeviceServiceTests
{
    [Fact]
    public async Task ApplyStatusChange_ShouldThrow_WhenTestingWithoutRegisteredFlag()
    {
        var deviceRepo = new Mock<DeviceRepository>();
        var historyRepo = new Mock<EntityChangeSetRepository>();
        var trashRepo = new Mock<TrashRepository>();
        var statusHistoryRepo = new Mock<DeviceStatusHistoryRepository>();
        var uow = new Mock<UnitOfWork>();

        var service = new DeviceService(
            uow.Object,
            deviceRepo.Object,
            historyRepo.Object,
            trashRepo.Object,
            statusHistoryRepo.Object
        );

        var device = new Device
        {
            Id = Guid.NewGuid(),
            Checked = DeviceLifecycleFlags.None,
            Status = DeviceStatus.None,
            StageResult = StageResult.None
        };

        await Assert.ThrowsAsync<InvalidOperationException>(() =>
            service.ApplyStatusChange(
                device,
                DeviceStatus.Testing,
                StageResult.None,
                "test"
            )
        );
    }
}