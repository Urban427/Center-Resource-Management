namespace CRM.Infrastructure.Configurations;
using CRM.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
public class DeviceConfiguration : IEntityTypeConfiguration<Device>
{
    public void Configure(EntityTypeBuilder<Device> builder)
    {
        builder.ToTable("devices");
        builder.HasKey(d => d.Id);
        builder.Property(d => d.Comment).HasMaxLength(500);
        builder.Property(d => d.Status).HasConversion<int>();
        builder.Property(d => d.Checked).HasConversion<int>();
        builder.Property(d => d.StageResult).HasConversion<int>();
        builder.Property(d => d.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
        builder.Property(d => d.UpdatedAt).IsRequired(false);
        builder.HasOne(d => d.DeviceType)
               .WithMany(dt => dt.Devices)
               .HasForeignKey(d => d.DeviceTypeId)
               .OnDelete(DeleteBehavior.Cascade);
        builder.HasOne(d => d.Booking)
               .WithMany()
               .HasForeignKey(d => d.BookingId)
               .OnDelete(DeleteBehavior.SetNull);
    }
}
