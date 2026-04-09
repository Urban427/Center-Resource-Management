namespace CRM.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using CRM.Domain.Entities;
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    public DbSet<Booking> Bookings => Set<Booking>();
    public DbSet<Device> Devices => Set<Device>();
    public DbSet<DeviceStatusHistory> DeviceStatusHistories => Set<DeviceStatusHistory>();
    public DbSet<DeviceType> DeviceTypes => Set<DeviceType>();
    public DbSet<EntityChange> EntityChanges => Set<EntityChange>();
    public DbSet<EntityChangeSet> EntityChangeSets => Set<EntityChangeSet>();
    public DbSet<TrashBinElement> TrashBinElements => Set<TrashBinElement>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<User> Users => Set<User>();
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }
}
