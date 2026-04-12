using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CRM.Domain.Entities;

namespace CRM.Domain.Abstractions;

public interface IUserRepository
{
    public Task AddAsync(User user);
    public Task<User?> GetByUsername(String username);
    public Task<User?> GetById(int id);
    IQueryable<User> Query();
}
