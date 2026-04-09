namespace CRM.Infrastructure.Configurations;
using CRM.Domain.Entities;
using CRM.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("users");
        builder.HasKey(t => t.Id);
        builder.Property(d => d.Email).HasMaxLength(100);
        builder.Property(d => d.Name).HasMaxLength(100);
        builder.Property(d => d.RoleId).HasConversion<int>();
        builder.Property(d => d.RoleName).HasMaxLength(100);
    }
}
