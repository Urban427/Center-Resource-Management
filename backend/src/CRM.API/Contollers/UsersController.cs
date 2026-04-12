namespace CRM.Controllers;

using CRM.Domain.Abstractions;
using CRM.Domain.DTO;
using CRM.Domain.Entities;
using CRM.Infrastructure.Repositories;
using CRM.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly UserService _userService;

    public UsersController(
        UserService userService
    ) {
        _userService = userService;
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
        var result = await _userService.Login(dto);

        if (result == null)
            return Unauthorized();

        return Ok(result);
    }

    [HttpPost("refresh")]
    [AllowAnonymous]
    public async Task<IActionResult> Refresh([FromBody] TokenDto dto)
    {
        var result = await _userService.RefreshToken(dto.RefreshToken);

        if (result == null)
            return Unauthorized();

        return Ok(result);
    }
}
