namespace CRM.Infrastructure.Configurations;
using CRM.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class DeviceStatusHistoryConfiguration : IEntityTypeConfiguration<DeviceStatusHistory>
{
    public void Configure(EntityTypeBuilder<DeviceStatusHistory> builder)
    {
        builder.ToTable("device_status_histories");
        builder.HasKey(h => h.Id);
        builder.Property(h => h.OldStatus).HasConversion<int>();
        builder.Property(h => h.NewStatus).HasConversion<int>();
        builder.Property(h => h.OldStageResult).HasConversion<int>();
        builder.Property(h => h.NewStageResult).HasConversion<int>();
        builder.Property(h => h.ChangedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
        builder.Property(h => h.ChangedBy).HasMaxLength(100);
        builder.Property(h => h.Comment).HasMaxLength(500);
        builder.HasOne(h => h.Device)
               .WithMany()
               .HasForeignKey(h => h.DeviceId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}
