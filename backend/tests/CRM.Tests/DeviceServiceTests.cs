using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CRM.Domain.Entities;
using CRM.Domain.Enums;
using CRM.Infrastructure.Repositories;
using CRM.Services;
using Moq;


namespace CRM.Tests;
public class DeviceServiceTests
{
    public DeviceServiceTests() {}

    [Fact]
    public async Task ApplyStatusChange_ShouldThrow_WhenTestingWithoutRegisteredFlag()
    {
        var service = new DeviceService(null!, null!, null!, null!);

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
