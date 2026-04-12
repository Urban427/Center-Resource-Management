using CRM.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Domain.Abstractions;

public interface IRefreshTokenRepository
{
    public Task<RefreshToken> AddAsync(RefreshToken element);
    public Task<RefreshToken?> GetByToken(String token);
}
