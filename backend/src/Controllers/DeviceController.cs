namespace CRM.Controllers;
using CRM.Domain.Entities;
using CRM.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class DeviceController : ControllerBase
{
    private readonly DeviceService _service;

    public DeviceController(DeviceService service)
    {
        _service = service;
    }

    // POST: api/device
    [HttpPost]
    public async Task<IActionResult> Register([FromBody] Device device)
    {
        try
        {
            await _service.RegisterDevice(device, "Sanya");
            return Ok(device);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.InnerException?.Message);
            return BadRequest(new { error = ex.Message });
        }
    }

    // GET: api/device
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
            var result = await _service.GetDevicesPaged(skip, pageSize, sort, order, search);

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
    //get device
    [HttpGet("{id:guid}")]
    public async Task<ActionResult> GetDevice(Guid id)
    {
        try
        {
            var device = await _service.GetDeviceById(id);
            return Ok(device);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.InnerException?.Message);
            return BadRequest(new { error = ex.Message });
        }
    }
    //get device
    [HttpGet("statusHistory/{id:guid}")]
    public async Task<ActionResult> GetStatusHistory(Guid id)
    {
        try
        {
            var history = await _service.getStatusHistory(id);
            return Ok(history);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.InnerException?.Message);
            return BadRequest(new { error = ex.Message });
        }
    }

    //soft delete
    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> SoftDelete(Guid id)
    {
        try
        {
            await _service.SoftDelete(id, "Sanya", "No longer needed");
            return Ok();
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.InnerException?.Message);
            return BadRequest(new { error = ex.Message });
        }
    }
}
