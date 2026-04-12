namespace CRM.Infrastructure.Repositories;
using CRM.Domain.Entities;
using CRM.Domain.Enums;
using CRM.Domain.Abstractions;
using CRM.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
public class BookingRepository : RepositoryBase, IBookingRepository
{
    public BookingRepository(AppDbContext db) : base(db) { }

    public Task AddAsync(Booking booking)
    {
        _context.Bookings.Add(booking);
        return Task.CompletedTask;
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
    public Task UpdateAsync(Booking booking)
    {
        _context.Bookings.Update(booking);
        return Task.CompletedTask;
    }
    public async Task<Booking?> GetByIdAsync(int id)
    {
        return await _context.Bookings
            .FirstOrDefaultAsync(d => d.Id == id);
    }
    public IQueryable<Booking> Query()
    {
        return _context.Bookings.AsQueryable();
    }
}
