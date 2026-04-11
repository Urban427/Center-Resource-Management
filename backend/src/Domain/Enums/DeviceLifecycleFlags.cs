namespace CRM.Domain.Enums;

[Flags]
public enum DeviceLifecycleFlags
{
    None = 0,

    // Lifecycle stages
    Registered = 1 << DeviceStatus.Registered,                  // 1
    TestingDone = 1 << DeviceStatus.Testing,                    // 2
    VisualTestingDone = 1 << DeviceStatus.VisualTesting,        // 4
    Released = 1 << DeviceStatus.Released,                      // 8
    InWarehouse = 1 << DeviceStatus.InWarehouse,                // 16
    SentToCustomer = 1 << DeviceStatus.SentToCustumer,          // 32

    // Test results (errors)
    TestingFailed = 1 << 8,         // 256
    VisualTestingFailed = 1 << 9,   // 512
    ElectricalFailed = 1 << 10,     // 1024
}
