namespace CRM.Controllers;
using CRM.Services;
using CRM.Domain.Entities;
using CRM.Domain.Enums;
using Microsoft.AspNetCore.Mvc;
using CRM.Infrastructure.Repositories;
using Microsoft.AspNetCore.Authorization;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class TrashController : ControllerBase
{
    private readonly TrashService _trashService;

    public TrashController(TrashService trashService)
    {
        _trashService = trashService;
    }

    [HttpGet]
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

            var result = await _trashService.GetTrashPaged(skip, pageSize, sort, order, search);

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

    //Restore
    [HttpPost("{id:int}")]
    public async Task<ActionResult> Restore(int id)
    {
        try
        {
            await _trashService.RestoreAsync(id, "Sanya");
            return Ok();
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.InnerException?.Message);
            return BadRequest(new { error = ex.Message });
        }
    }

    // DELETE api/trash/{id} 
    [HttpDelete("{id:int}")]
    public async Task<ActionResult> Delete(int id)
    {
        return NoContent();
    }
}
