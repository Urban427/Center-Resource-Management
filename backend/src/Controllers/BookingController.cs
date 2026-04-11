namespace CRM.Controllers;
using CRM.Domain.Entities;
using CRM.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class BookingController : ControllerBase
{
    private readonly BookingService _service;

    public BookingController(BookingService service)
    {
        _service = service;
    }

    // POST: api/booking
    [HttpPost]
    public async Task<IActionResult> Register([FromBody] Booking booking)
    {
        try
        {
            await _service.RegisterBookingAsync(booking, "Sanya");
            return Ok(booking);
        }
        catch (Exception ex)
        {
            Console.WriteLine("Exception: " + ex.Message);
            if (ex.InnerException != null)
                Console.WriteLine("Inner exception: " + ex.InnerException.Message);
            Console.WriteLine(ex);
            return BadRequest(new { error = ex.Message });
        }
    }

    // GET: api/booking
    [HttpGet]
    public async Task<IActionResult> GetBooking(
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

            // Get filtered, sorted, paged books
            var result = await _service.GetBooksPaged(skip, pageSize, sort, order, search);

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
