namespace CRM.Controllers;
using CRM.Services;
using CRM.Domain.Entities;
using CRM.Domain.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class DashBoardController : ControllerBase
{
    private readonly DashBoardService _service;

    public DashBoardController(DashBoardService service)
    {
        _service = service;
    }

    // GET: api/dashboard
    [HttpGet]
    public async Task<IActionResult> GetDashboardData()
    {
        try
        {
            var dashboardData = await _service.GetDashboardData();
            return Ok(dashboardData);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.InnerException?.Message);
            return BadRequest(new { error = ex.Message });
        }
    }
}
