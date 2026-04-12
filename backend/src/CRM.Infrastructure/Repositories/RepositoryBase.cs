using CRM.Infrastructure.Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Infrastructure.Repositories;
public abstract class RepositoryBase
{
    protected readonly AppDbContext _context;

    protected RepositoryBase(AppDbContext context)
    {
        _context = context;
    }
}
