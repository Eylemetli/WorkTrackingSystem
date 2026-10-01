using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WorkTracking.Application.DTOs.Projects;
using WorkTracking.Application.Interfaces;

namespace WorkTracking.API.Controllers;

[ApiController]
[Route("api/admin/projects")]
[Authorize(Policy = "AdminOnly")]
public class AdminProjectsController : ControllerBase
{
    private readonly IProjectService _projectService;

    public AdminProjectsController(IProjectService projectService)
    {
        _projectService = projectService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _projectService.GetAllAsync());
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var project = await _projectService.GetByIdAsync(id);

        if (project is null)
            return NotFound(new { message = "Proje bulunamadı." });

        return Ok(project);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateProjectRequest request)
    {
        try
        {
            var project = await _projectService.CreateAsync(request);

            return CreatedAtAction(
                nameof(GetById),
                new { id = project.Id },
                project);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(
        int id,
        UpdateProjectRequest request)
    {
        try
        {
            var project = await _projectService.UpdateAsync(id, request);

            if (project is null)
                return NotFound(new { message = "Proje bulunamadı." });

            return Ok(project);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}