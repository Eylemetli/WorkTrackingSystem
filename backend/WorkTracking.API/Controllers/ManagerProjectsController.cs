using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WorkTracking.Application.Interfaces;

namespace WorkTracking.API.Controllers;

[ApiController]
[Route("api/manager/projects")]
[Authorize(Policy = "ManagerOnly")]
public class ManagerProjectsController : ControllerBase
{
    private readonly IProjectService _projectService;

    public ManagerProjectsController(IProjectService projectService)
    {
        _projectService = projectService;
    }

    [HttpGet]
    public async Task<IActionResult> GetMyProjects()
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrWhiteSpace(userIdValue))
        {
            return Unauthorized();
        }

        var managerId = int.Parse(userIdValue);

        var projects = await _projectService.GetByManagerAsync(managerId);

        return Ok(projects);
    }
    [HttpGet("{id}")]
    public async Task<IActionResult> GetProjectById(int id)
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrWhiteSpace(userIdValue))
        {
            return Unauthorized();
        }

        var managerId = int.Parse(userIdValue);

        var projects = await _projectService.GetByManagerAsync(managerId);

        var project = projects.FirstOrDefault(p => p.Id == id);

        if (project == null)
        {
            return NotFound(new
            {
                message = "Proje bulunamadı veya bu projeye erişim yetkiniz yok."
            });
        }

        return Ok(project);
    }
}