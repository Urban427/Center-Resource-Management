namespace CRM.Infrastructure.Configurations;
using CRM.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
public class DeviceTypeConfiguration : IEntityTypeConfiguration<DeviceType>
{
    void IEntityTypeConfiguration<DeviceType>.Configure(EntityTypeBuilder<DeviceType> builder)
    {
        builder.ToTable("device_types");
        builder.HasKey(dt => dt.Id);
        builder.Property(dt => dt.Name).HasMaxLength(200).IsRequired();
        builder.Property(dt => dt.Comment).HasMaxLength(500);
        builder.Property(dt => dt.Status).IsRequired();
        builder.Property(dt => dt.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
        builder.HasMany(dt => dt.Devices)
               .WithOne(d => d.DeviceType)
               .HasForeignKey(d => d.DeviceTypeId);
    }
}
