namespace CRM.Infrastructure.Configurations;
using CRM.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class TrashBinElementConfiguration : IEntityTypeConfiguration<TrashBinElement>
{
    public void Configure(EntityTypeBuilder<TrashBinElement> builder)
    {
        builder.ToTable("trash_bin_elements");
        builder.HasKey(t => t.Id);
        builder.Property(t => t.EntityName).HasMaxLength(200).IsRequired();
        builder.Property(t => t.EntityKey).HasMaxLength(100).IsRequired();
        builder.Property(t => t.PreviousStatus).HasMaxLength(100).IsRequired();
        builder.Property(t => t.DeletedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
        builder.Property(t => t.ExpiresAt).IsRequired();
        builder.Property(t => t.DeletedBy).HasMaxLength(100);
        builder.Property(t => t.Reason).HasMaxLength(500);
    }
}
