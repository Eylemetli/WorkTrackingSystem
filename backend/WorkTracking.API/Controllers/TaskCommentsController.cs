using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WorkTracking.Application.DTOs.TaskComments;
using WorkTracking.Application.Interfaces;

namespace WorkTracking.API.Controllers;

[ApiController]
[Route("api/tasks/{taskId:int}/comments")]
[Authorize]
public class TaskCommentsController : ControllerBase
{
    private readonly ITaskCommentService _taskCommentService;

    public TaskCommentsController(ITaskCommentService taskCommentService)
    {
        _taskCommentService = taskCommentService;
    }

    [HttpGet]
    public async Task<IActionResult> GetComments(int taskId)
    {
        var comments = await _taskCommentService.GetByTaskIdAsync(taskId);
        return Ok(comments);
    }

    [HttpPost]
    public async Task<IActionResult> CreateComment(
        int taskId,
        CreateTaskCommentRequest request)
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

            var comment = await _taskCommentService.CreateAsync(
                taskId,
                userId,
                request);

            return Ok(comment);
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