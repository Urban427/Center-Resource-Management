using CRM.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore.Storage;
using CRM.Domain.Abstractions;

using CRM.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore.Storage;
using CRM.Domain.Abstractions;

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _context;
    private IDbContextTransaction? _transaction;

    public UnitOfWork(AppDbContext context)
    {
        _context = context;
    }

    public async Task BeginTransactionAsync()
    {
        _transaction = await _context.Database.BeginTransactionAsync();
    }

    public async Task CommitAsync()
    {
        if (_transaction != null)
            await _transaction.CommitAsync();
    }

    public async Task RollbackAsync()
    {
        if (_transaction != null)
            await _transaction.RollbackAsync();
    }

    public Task SaveChangesAsync()
        => _context.SaveChangesAsync();
}