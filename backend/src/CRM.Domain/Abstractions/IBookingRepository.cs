using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CRM.Domain.Entities;

namespace CRM.Domain.Abstractions;
public interface IBookingRepository
{
    Task UpdateAsync(Booking booking);
    Task AddAsync(Booking booking);
    Task<List<Booking>> GetRangeAsync(int skip, int take);
    Task<Booking?> GetByIdAsync(int id);
    IQueryable<Booking> Query();
}
