namespace CRM.Services;

using CRM.Domain.DTO;
using CRM.Domain.Entities;
using CRM.Domain.Enums;
using CRM.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Cryptography;

public class UserService
{
    private readonly UserRepository _users;
    private readonly IConfiguration _config;
    public UserService(
        UserRepository users,
        IConfiguration config)
    {
        _users = users;
        _config = config;
    }

    public async Task<User?> GetById(int id)
    {
        return await _users.GetById(id);
    }

    public async Task<(List<User> Items, int Total)> GetUsersPaged(
       int skip, int take, string? sort, string? order, string? searchTerm)
    {
        var query = _users.Context.Users.AsQueryable();

        // Search
        if (!string.IsNullOrEmpty(searchTerm))
        {
            query = query.Where(d =>
                d.Id.ToString().Contains(searchTerm) ||
                d.RoleId.ToString().Contains(searchTerm));
        }

        // Total count before paging
        int total = await query.CountAsync();

        var items = await query
            .Skip(skip)
            .Take(take)
            .ToListAsync();

        return (items, total);
    }

    public async Task RegisterUser(User newUser, string? user)
    {
        //update
        if (newUser.Id != 0)
        {
            return;
        }
        await _users.AddAsync(newUser);
        await _users.SaveChangesAsync();
    }

    public async Task<User?> Authenticate(String username) {
        var user = await _users.GetByUsername(username);
        if (user == null)
            return null;
        return user;
    }

    public string GenerateJwtToken(User user)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.Name, user.Name),
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
        };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_config["Jwt:Key"])
        );

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.Now.AddMinutes(10),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public string GenerateRefreshToken()
    {
        var randomBytes = new byte[32];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomBytes);
        return Convert.ToBase64String(randomBytes);
    }
}