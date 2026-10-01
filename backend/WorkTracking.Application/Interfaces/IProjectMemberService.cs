using WorkTracking.Application.DTOs.ProjectMembers;

namespace WorkTracking.Application.Interfaces;

public interface IProjectMemberService
{
    Task<List<ProjectMemberDto>> GetMembersAsync(int projectId);

    Task<ProjectMemberDto> AddMemberAsync(
        int projectId,
        AddProjectMemberRequest request);

    Task<bool> RemoveMemberAsync(
        int projectId,
        int userId);
}