namespace CRM.Controllers;
using CRM.Services;
using CRM.Domain.Entities;
using CRM.Domain.Enums;
using Microsoft.AspNetCore.Mvc;
using CRM.Infrastructure.Repositories;
using Microsoft.AspNetCore.Authorization;
using CRM.Domain.DTO;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly UserService _userService;
    private readonly RefreshTokenRepository _refreshTokenRepository;

    public UsersController(
        UserService userService,
        RefreshTokenRepository refreshTokenRepository
    )
    {
        _userService = userService;
        _refreshTokenRepository = refreshTokenRepository;
    }

    // GET: api/users
    [HttpGet]
    public async Task<IActionResult> GetDevices(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? sort = "id",
        [FromQuery] string? order = "asc",
        [FromQuery] string? search = null)
    {
        try
        {
            if (page < 1) page = 1;
            if (pageSize < 1) pageSize = 10;
            int skip = (page - 1) * pageSize;

            // Get filtered, sorted, paged devices
            var result = await _userService.GetUsersPaged(skip, pageSize, sort, order, search);

            var response = new
            {
                items = result.Items,
                total = result.Total
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.InnerException?.Message);
            return BadRequest(new { error = ex.Message });
        }
    }

    // POST: api/user
    [HttpPost]
    public async Task<IActionResult> Register([FromBody] User user)
    {
        try
        {
            await _userService.RegisterUser(user, "Sanya");
            return Ok(user);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.InnerException?.Message);
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var user = await _userService.Authenticate(dto.Username);

        if (user == null)
            return Unauthorized();

        var accessToken = _userService.GenerateJwtToken(user);
        var refreshToken = _userService.GenerateRefreshToken();

        var refreshTokenEntity = new RefreshToken
        {
            Token = refreshToken,
            ExpiryTime = DateTime.UtcNow.AddDays(1),
            UserId = user.Id,
            IsRevoked = false
        };

        await _refreshTokenRepository.AddAsync(refreshTokenEntity);
        await _refreshTokenRepository.SaveChangesAsync();

        return Ok(new
        {
            accessToken,
            refreshToken,
            user
        });
    }

    [HttpPost("refresh")]
    [AllowAnonymous]
    public async Task<IActionResult> Refresh([FromBody] TokenDto dto)
    {
        var token = await _refreshTokenRepository.GetByToken(dto.RefreshToken);

        if (token == null || token.IsRevoked || token.ExpiryTime < DateTime.UtcNow)
            return Unauthorized();

        var user = await _userService.GetById(token.UserId);

        var newAccessToken = _userService.GenerateJwtToken(user);
        var newRefreshToken = _userService.GenerateRefreshToken();

        token.IsRevoked = true;
        var newTokenEntity = new RefreshToken
        {
            Token = newRefreshToken,
            ExpiryTime = DateTime.UtcNow.AddDays(1),
            UserId = user.Id
        };

        await _refreshTokenRepository.AddAsync(newTokenEntity);
        await _refreshTokenRepository.SaveChangesAsync();

        return Ok(new
        {
            accessToken = newAccessToken,
            refreshToken = newRefreshToken
        });
    }
}
