using Microsoft.EntityFrameworkCore;
using WorkTracking.Application.DTOs.ProjectMembers;
using WorkTracking.Application.Interfaces;
using WorkTracking.Domain.Entities;
using WorkTracking.Infrastructure.Persistence;

namespace WorkTracking.Infrastructure.Services;

public class ProjectMemberService : IProjectMemberService
{
    private readonly AppDbContext _context;

    public ProjectMemberService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<ProjectMemberDto>> GetMembersAsync(int projectId)
    {
        return await _context.ProjectMembers
            .AsNoTracking()
            .Where(pm => pm.ProjectId == projectId)
            .Include(pm => pm.User)
            .Select(pm => new ProjectMemberDto
            {
                Id = pm.Id,
                ProjectId = pm.ProjectId,
                UserId = pm.UserId,
                FullName = pm.User.FirstName + " " + pm.User.LastName,
                Email = pm.User.Email,
                JoinedAt = pm.JoinedAt
            })
            .ToListAsync();
    }

    public async Task<ProjectMemberDto> AddMemberAsync(
        int projectId,
        AddProjectMemberRequest request)
    {
        var projectExists = await _context.Projects
            .AnyAsync(p => p.Id == projectId);

        if (!projectExists)
            throw new InvalidOperationException("Proje bulunamadı.");

        var user = await _context.Users
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Id == request.UserId);

        if (user is null)
            throw new InvalidOperationException("Kullanıcı bulunamadı.");

        if (user.Role.Name != "Employee")
            throw new InvalidOperationException(
                "Projeye sadece Employee rolündeki kullanıcı eklenebilir.");

        var alreadyMember = await _context.ProjectMembers
            .AnyAsync(pm =>
                pm.ProjectId == projectId &&
                pm.UserId == request.UserId);

        if (alreadyMember)
            throw new InvalidOperationException(
                "Bu kullanıcı zaten projeye eklenmiş.");

        var projectMember = new ProjectMember
        {
            ProjectId = projectId,
            UserId = request.UserId,
            JoinedAt = DateTime.UtcNow
        };

        _context.ProjectMembers.Add(projectMember);
        await _context.SaveChangesAsync();

        return new ProjectMemberDto
        {
            Id = projectMember.Id,
            ProjectId = projectMember.ProjectId,
            UserId = user.Id,
            FullName = user.FirstName + " " + user.LastName,
            Email = user.Email,
            JoinedAt = projectMember.JoinedAt
        };
    }

    public async Task<bool> RemoveMemberAsync(
        int projectId,
        int userId)
    {
        var member = await _context.ProjectMembers
            .FirstOrDefaultAsync(pm =>
                pm.ProjectId == projectId &&
                pm.UserId == userId);

        if (member is null)
            return false;

        _context.ProjectMembers.Remove(member);
        await _context.SaveChangesAsync();

        return true;
    }
}