using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WorkTracking.Application.Interfaces;

namespace WorkTracking.API.Controllers;

[ApiController]
[Route("api/employee/tasks")]
[Authorize(Policy = "EmployeeOnly")]
public class EmployeeTasksController : ControllerBase
{
    private readonly ITaskService _taskService;

    public EmployeeTasksController(ITaskService taskService)
    {
        _taskService = taskService;
    }

    [HttpGet]
    public async Task<IActionResult> GetMyTasks()
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier)
                          ?? User.FindFirstValue("sub");

        if (!int.TryParse(userIdValue, out var userId))
            return Unauthorized(new { message = "Kullanıcı bilgisi alınamadı." });

        var tasks = await _taskService.GetByAssignedUserAsync(userId);

        return Ok(tasks);
    }

    [HttpPatch("{id:int}/status")]
    public async Task<IActionResult> UpdateStatus(
        int id,
        [FromQuery] int status)
    {
        try
        {
            var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier)
                              ?? User.FindFirstValue("sub");

            if (!int.TryParse(userIdValue, out var userId))
                return Unauthorized(new { message = "Kullanıcı bilgisi alınamadı." });

            var task = await _taskService.UpdateStatusAsync(
                id,
                userId,
                status);

            if (task is null)
            {
                return NotFound(new
                {
                    message = "Görev bulunamadı veya bu görev size ait değil."
                });
            }

            return Ok(task);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }
}