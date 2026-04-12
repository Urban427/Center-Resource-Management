using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CRM.Domain.Entities;

namespace CRM.Domain.Abstractions;

public interface IEntityChangeSetRepository
{
    public Task<EntityChangeSet?> GetByIdAsync(long id);
    public Task<IReadOnlyList<EntityChangeSet>> GetByEntityAsync(string entityName, string entityId);
    public Task AddAsync(EntityChangeSet changeSet);
    public Task DeleteAsync(long id);
    IQueryable<EntityChangeSet> Query();
}
