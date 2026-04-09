namespace CRM.Infrastructure.Repositories;
using CRM.Domain.Entities;
using CRM.Domain.Enums;
using CRM.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
public class BookingRepository: RepositoryBase
{
    public BookingRepository(AppDbContext db) : base(db) { }

    public async Task AddAsync(Booking booking)
    {
        _context.Bookings.Add(booking);
        await _context.SaveChangesAsync();
    }
    public async Task<List<Booking>> GetRangeAsync(int skip, int take)
    {
        return await _context.Bookings
            .Where(d => d.Status != BookingStatus.Deleted)
            .OrderBy(d => d.Id)
            .Skip(skip)
            .Take(take)
            .ToListAsync();
    }
    public async Task<List<Booking>> SearchAsync(string term)
    {
        return await _context.Bookings
            .OrderBy(d => d.Id)
            .ToListAsync();
    }
    public async Task UpdateAsync(Booking booking)
    {
        _context.Bookings.Update(booking);
        await _context.SaveChangesAsync();
    }
    public async Task<Booking?> GetByIdAsync(int id)
    {
        return await _context.Bookings
            .FirstOrDefaultAsync(d => d.Id == id);
    }
}
