namespace CRM.Infrastructure.Configurations;
using CRM.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
public class BookingConfiguration : IEntityTypeConfiguration<Booking>
{
    public void Configure(EntityTypeBuilder<Booking> builder)
    {
        builder.ToTable("bookings");
        builder.HasKey(b => b.Id);
        builder.Property(b => b.NumberOfDevices).IsRequired();
        builder.Property(b => b.Comment).HasMaxLength(500);
        builder.Property(b => b.Status).HasConversion<int>();
        builder.Property(b => b.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
        builder.HasOne(b => b.DeviceType)
               .WithMany()
               .HasForeignKey(b => b.DeviceTypeId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}
