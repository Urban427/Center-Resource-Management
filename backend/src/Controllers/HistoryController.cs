namespace CRM.Controllers;
using CRM.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class HistoryController : ControllerBase
{
    private readonly HistoryService _service;
    public HistoryController(HistoryService service)
    {
        _service = service;
    }

    //history get
    [HttpGet("{entityName}/{entityId}")]
    public async Task<IActionResult> GetHistoryById(
        string entityId,
        string entityName
    )
    {
        try
        {
            var history = await _service.getHistory(entityName, entityId);
            return Ok(history);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.InnerException?.Message);
            return BadRequest(new { error = ex.Message });
        }
    }
}
