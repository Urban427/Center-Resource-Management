namespace CRM.Infrastructure.Configurations;
using CRM.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class EntityChangeConfiguration : IEntityTypeConfiguration<EntityChange>
{
    public void Configure(EntityTypeBuilder<EntityChange> builder)
    {
        builder.ToTable("entity_changes");
        builder.HasKey(c => c.Id);
        builder.Property(c => c.PropertyName).HasMaxLength(200).IsRequired();
        builder.Property(c => c.OldValue).HasMaxLength(1000);
        builder.Property(c => c.NewValue).HasMaxLength(1000);
    }
}
