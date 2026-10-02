using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WorkTracking.Application.DTOs.WorkLogs;
using WorkTracking.Application.Interfaces;

namespace WorkTracking.API.Controllers;

[ApiController]
[Route("api/tasks/{taskId:int}/worklogs")]
[Authorize]
public class WorkLogsController : ControllerBase
{
    private readonly IWorkLogService _workLogService;

    public WorkLogsController(IWorkLogService workLogService)
    {
        _workLogService = workLogService;
    }

    [HttpGet]
    public async Task<IActionResult> GetByTaskId(int taskId)
    {
        var workLogs = await _workLogService.GetByTaskIdAsync(taskId);
        return Ok(workLogs);
    }

    [HttpPost]
    [Authorize(Policy = "EmployeeOnly")]
    public async Task<IActionResult> Create(
        int taskId,
        CreateWorkLogRequest request)
    {
        try
        {
            var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier)
                              ?? User.FindFirstValue("sub");

            if (!int.TryParse(userIdValue, out var userId))
            {
                return Unauthorized(new
                {
                    message = "Kullanıcı bilgisi alınamadı."
                });
            }

            var workLog = await _workLogService.CreateAsync(
                taskId,
                userId,
                request);

            return Ok(workLog);
        }
        catch (UnauthorizedAccessException ex)
        {
            return StatusCode(403, new
            {
                message = ex.Message
            });
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