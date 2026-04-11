using CRM.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore.Storage;

public abstract class RepositoryBase
{
    protected readonly AppDbContext _context;

    protected RepositoryBase(AppDbContext context)
    {
        _context = context;
    }
    public AppDbContext Context => _context;
    public Task<IDbContextTransaction> BeginTransactionAsync()
        => _context.Database.BeginTransactionAsync();

    public Task SaveChangesAsync()
        => _context.SaveChangesAsync();
}
