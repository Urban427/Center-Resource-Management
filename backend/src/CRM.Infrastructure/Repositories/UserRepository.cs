using CRM.Domain.Abstractions;
using CRM.Domain.Entities;
using CRM.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Repositories;

public class UserRepository : RepositoryBase, IUserRepository
{
    public UserRepository(AppDbContext db) : base(db) { }
    public async Task AddAsync(User user)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
    }
    public async Task<User?> GetByUsername(String username)
    {
        return await _context.Users
            .FirstOrDefaultAsync(u => u.Name == username);
    }
    public async Task<User?> GetById(int id)
    {
        return await _context.Users
            .FirstOrDefaultAsync(u => u.Id == id);
    }
    public IQueryable<User> Query()
    {
        return _context.Users.AsQueryable();
    }
}
