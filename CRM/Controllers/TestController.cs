namespace CRM.Controllers;
using CRM.Services;
using CRM.Domain.Entities;
using CRM.Domain.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Authorization;

[Authorize]
[ApiController]
[Route("api/history")]
public class DeviceStatusHistoryController : ControllerBase
{
    private readonly DeviceTestingService _service;

    public DeviceStatusHistoryController(DeviceTestingService service)
    {
        _service = service;
    }

    [HttpPost("{deviceId:guid}/record")]
    public async Task<IActionResult> Record(
         [FromRoute] Guid deviceId,
         [FromQuery] DeviceStatus status,
         [FromQuery] StageResult result,
         [FromQuery] string? Comment)
    {
        try
        {
            if (result == StageResult.None)
                return BadRequest("Test result cannot be None.");

            var deviceStatus = await _service.RecordStatusChange(
                deviceId,
                status,
                result,
                Comment,
                "Александр");

            return Ok(deviceStatus);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.InnerException?.Message);
            return BadRequest(new { error = ex.Message });
        }
    }


    [HttpGet("tests")]
    public async Task<IActionResult> GetTests(
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

            var result = await _service.GetTestsPaged(skip, pageSize, sort, order, search);

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
}
