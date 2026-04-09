using CRM.Domain.Entities;
using CRM.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Repositories;

public class RefreshTokenRepository : RepositoryBase
{
    public RefreshTokenRepository(AppDbContext db) : base(db) { }

    // Add a new
    public async Task<RefreshToken> AddAsync(RefreshToken element)
    {
        _context.Set<RefreshToken>().Add(element);
        return element;
    }
    public async Task<RefreshToken?> GetByToken(String token)
    {
        return await _context.RefreshTokens
           .FirstOrDefaultAsync(u => u.Token == token);
    }
}
