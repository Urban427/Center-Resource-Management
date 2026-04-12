using Moq;
using Xunit;
using CRM.Services;
using CRM.Domain.Entities;
using CRM.Domain.Enums;
using CRM.Infrastructure.Repositories;
using CRM.Domain.Abstractions;
using CRM.Domain.DTO;

namespace CRM.Tests;

public class TrashServiceTests
{
    private TrashService CreateService(
        Mock<ITrashRepository> trashRepo,
        Mock<IEntityTypeRegistry>? typeRegistry = null,
        Mock<IEntityChangeSetRepository>? history = null,
        Mock<IUnitOfWork>? uow = null)
    {
        return new TrashService(
            trashRepo.Object,
            Mock.Of<IDeviceRepository>(),
            Mock.Of<IDeviceTypeRepository>(),
            Mock.Of<IBookingRepository>(),
            history?.Object ?? Mock.Of<IEntityChangeSetRepository>(),
            uow?.Object ?? Mock.Of<IUnitOfWork>(),
            typeRegistry?.Object ?? Mock.Of<IEntityTypeRegistry>()
        );
    }
    [Fact]
    public async Task RestoreAsync_ShouldThrow_WhenTrashNotFound()
    {
        var trashRepo = new Mock<ITrashRepository>();
        trashRepo.Setup(x => x.GetByIdAsync(1)).ReturnsAsync((TrashBinElement?)null);
        var service = CreateService(trashRepo);
        await Assert.ThrowsAsync<Exception>(() =>
            service.RestoreAsync(1, "user")
        );
    }
    [Fact]
    public async Task RestoreAsync_ShouldRestore_AndCallDependencies()
    {
        var trashRepo = new Mock<ITrashRepository>();
        var historyRepo = new Mock<IEntityChangeSetRepository>();
        var uow = new Mock<IUnitOfWork>();
        var typeRegistry = new Mock<IEntityTypeRegistry>();
        var device = new Device { Status = DeviceStatus.Deleted };
        var trash = new TrashBinElement
        {
            Id = 1,
            EntityName = "Device",
            EntityKey = "1",
            PreviousStatus = DeviceStatus.Deleted.ToString()
        };
        trashRepo.Setup(x => x.GetByIdAsync(1)).ReturnsAsync(trash);
        typeRegistry.Setup(x => x.GetClrType("Device")).Returns(typeof(Device));
        typeRegistry.Setup(x => x.GetPrimaryKeyType(typeof(Device))).Returns(typeof(int));
        trashRepo.Setup(x => x.FindEntityAsync(typeof(Device), 1)).ReturnsAsync(device);
        var service = new TrashService(
            trashRepo.Object,
            Mock.Of<IDeviceRepository>(),
            Mock.Of<IDeviceTypeRepository>(),
            Mock.Of<IBookingRepository>(),
            historyRepo.Object,
            uow.Object,
            typeRegistry.Object
        );
        await service.RestoreAsync(1, "admin");
        historyRepo.Verify(x => x.AddAsync(It.IsAny<EntityChangeSet>()), Times.Once);
        trashRepo.Verify(x => x.RemoveAsync(trash), Times.Once);
        uow.Verify(x => x.SaveChangesAsync(), Times.Once);
    }
}
