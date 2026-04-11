namespace CRM.Controllers;
using CRM.Domain.Entities;
using CRM.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class DeviceTypeController : ControllerBase
{
    private readonly DeviceTypeService _service;

    public DeviceTypeController(DeviceTypeService service)
    {
        _service = service;
    }

    // POST: api/deviceType
    [HttpPost]
    public async Task<IActionResult> Register([FromBody] DeviceType deviceType)
    {
        try
        {
            await _service.RegisterDeviceType(deviceType, "Григорий");
            return Ok(deviceType);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.InnerException?.Message);
            return BadRequest(new { error = ex.Message });
        }
    }
    // GET: api/deviceType
    [HttpGet]
    public async Task<IActionResult> GetDeviceTypes(
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
            var result = await _service.GetDeviceTypesPaged(skip, pageSize, sort, order, search);
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
    // GET: api/deviceType
    [HttpGet("search")]
    public async Task<IActionResult> GetDeviceTypesByName([FromQuery] string name)
    {
        try
        {
            var result = await _service.GetDeviceTypesByNamePaged(name);
            return Ok(result);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.InnerException?.Message);
            return BadRequest(new { error = ex.Message });
        }
    }
    //Delete
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteDeviceType([FromRoute] int id)
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
