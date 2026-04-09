namespace CRM.Infrastructure.Configurations;
using CRM.Domain.Entities;
using CRM.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class EntityChangeSetConfiguration : IEntityTypeConfiguration<EntityChangeSet>
{
    public void Configure(EntityTypeBuilder<EntityChangeSet> builder)
    {
        builder.ToTable("entity_change_sets");
        builder.HasKey(c => c.Id);
        builder.Property(c => c.EntityName).HasMaxLength(200).IsRequired();
        builder.Property(c => c.EntityId).HasMaxLength(100).IsRequired();
        builder.Property(c => c.Operation).HasConversion<int>();
        builder.Property(c => c.ChangedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
        builder.Property(c => c.ChangedBy).HasMaxLength(100);
        builder.Property(c => c.Comment).HasMaxLength(500);
        builder.HasMany(c => c.Changes)
            .WithOne()
            .HasForeignKey(c => c.ChangeSetId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
