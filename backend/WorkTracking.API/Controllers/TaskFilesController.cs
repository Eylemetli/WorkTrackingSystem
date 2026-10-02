using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WorkTracking.Application.Interfaces;

namespace WorkTracking.API.Controllers;

[ApiController]
[Route("api/tasks/{taskId:int}/files")]
[Authorize]
public class TaskFilesController : ControllerBase
{
    private readonly IFileService _fileService;
    private readonly IWebHostEnvironment _environment;

    public TaskFilesController(
        IFileService fileService,
        IWebHostEnvironment environment)
    {
        _fileService = fileService;
        _environment = environment;
    }

    [HttpGet]
    public async Task<IActionResult> GetFiles(int taskId)
    {
        var files = await _fileService.GetByTaskIdAsync(taskId);
        return Ok(files);
    }

    [HttpPost]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UploadFile(
        int taskId,
        IFormFile file)
    {
        try
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new
                {
                    message = "Dosya seçilmedi."
                });
            }

            var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier)
                              ?? User.FindFirstValue("sub");

            if (!int.TryParse(userIdValue, out var userId))
            {
                return Unauthorized(new
                {
                    message = "Kullanıcı bilgisi alınamadı."
                });
            }

            var uploadsFolder = Path.Combine(
                _environment.ContentRootPath,
                "Uploads");

            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            var uniqueFileName =
                $"{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";

            var physicalPath = Path.Combine(
                uploadsFolder,
                uniqueFileName);

            await using (var stream = new FileStream(
                physicalPath,
                FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var relativePath = Path.Combine(
                "Uploads",
                uniqueFileName);

            var result = await _fileService.SaveAsync(
                taskId,
                userId,
                file.FileName,
                relativePath);

            return Ok(result);
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