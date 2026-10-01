using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WorkTracking.Application.DTOs.ProjectMembers;
using WorkTracking.Application.Interfaces;

namespace WorkTracking.API.Controllers;

[ApiController]
[Route("api/projects/{projectId:int}/members")]
[Authorize(Policy = "AdminOrManager")]
public class ProjectMembersController : ControllerBase
{
    private readonly IProjectMemberService _projectMemberService;

    public ProjectMembersController(
        IProjectMemberService projectMemberService)
    {
        _projectMemberService = projectMemberService;
    }

    [HttpGet]
    public async Task<IActionResult> GetMembers(int projectId)
    {
        var members = await _projectMemberService
            .GetMembersAsync(projectId);

        return Ok(members);
    }

    [HttpPost]
    public async Task<IActionResult> AddMember(
        int projectId,
        AddProjectMemberRequest request)
    {
        try
        {
            var member = await _projectMemberService
                .AddMemberAsync(projectId, request);

            return Ok(member);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }

    [HttpDelete("{userId:int}")]
    public async Task<IActionResult> RemoveMember(
        int projectId,
        int userId)
    {
        var result = await _projectMemberService
            .RemoveMemberAsync(projectId, userId);

        if (!result)
        {
            return NotFound(new
            {
                message = "Proje üyesi bulunamadı."
            });
        }

        return Ok(new
        {
            message = "Çalışan projeden çıkarıldı."
        });
    }
}