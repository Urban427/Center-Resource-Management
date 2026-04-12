using Moq;
using Xunit;
using CRM.Services;
using CRM.Domain.Entities;
using CRM.Domain.Enums;
using CRM.Infrastructure.Repositories;
using CRM.Domain.Abstractions;

namespace CRM.Tests;

public class DeviceServiceTests
{
    private readonly Mock<IDeviceRepository> _deviceRepo = new();
    private readonly Mock<IEntityChangeSetRepository> _historyRepo = new();
    private readonly Mock<ITrashRepository> _trashRepo = new();
    private readonly Mock<IDeviceStatusHistoryRepository> _statusHistoryRepo = new();
    private readonly Mock<IUnitOfWork> _uow = new();

    private DeviceService CreateService()
    {
        return new DeviceService(
            _uow.Object,
            _deviceRepo.Object,
            _historyRepo.Object,
            _trashRepo.Object,
            _statusHistoryRepo.Object
        );
    }

    [Fact]
    public async Task ApplyStatusChange_Testing_WithoutRegistered_ShouldThrow()
    {
        // Arrange
        var service = CreateService();

        var device = new Device
        {
            Id = Guid.NewGuid(),
            Checked = DeviceLifecycleFlags.None,
            Status = DeviceStatus.Registered
        };

        // Act + Assert
        await Assert.ThrowsAsync<InvalidOperationException>(() =>
            service.ApplyStatusChange(
                device,
                DeviceStatus.Testing,
                StageResult.None,
                "test"
            )
        );
    }

    [Fact]
    public async Task ApplyStatusChange_Testing_WithRegistered_ShouldPass()
    {
        // Arrange
        var service = CreateService();

        var device = new Device
        {
            Id = Guid.NewGuid(),
            Status = DeviceStatus.Registered,
            Checked = DeviceLifecycleFlags.Registered
        };

        _statusHistoryRepo
            .Setup(x => x.AddAsync(It.IsAny<DeviceStatusHistory>()))
            .Returns(Task.CompletedTask);

        _deviceRepo
            .Setup(x => x.UpdateAsync(It.IsAny<Device>()))
            .Returns(Task.CompletedTask);

        // Act
        var result = await service.ApplyStatusChange(
            device,
            DeviceStatus.Testing,
            StageResult.Passed,
            "ok"
        );

        // Assert
        Assert.Equal(DeviceStatus.Testing, device.Status);
        Assert.Equal(StageResult.Passed, device.StageResult);
        Assert.NotNull(result);
        Assert.Equal(device.Id, result.DeviceId);
    }

    [Fact]
    public async Task ApplyStatusChange_Released_WithoutFlags_ShouldThrow()
    {
        // Arrange
        var service = CreateService();

        var device = new Device
        {
            Id = Guid.NewGuid(),
            Status = DeviceStatus.Testing,
            Checked = DeviceLifecycleFlags.Registered // insufficient for Released
        };

        // Act + Assert
        await Assert.ThrowsAsync<InvalidOperationException>(() =>
            service.ApplyStatusChange(
                device,
                DeviceStatus.Released,
                StageResult.Passed,
                "release"
            )
        );
    }
}