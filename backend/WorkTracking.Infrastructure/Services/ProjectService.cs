using Microsoft.EntityFrameworkCore;
using WorkTracking.Application.DTOs.Projects;
using WorkTracking.Application.Interfaces;
using WorkTracking.Domain.Entities;
using WorkTracking.Domain.Enums;
using WorkTracking.Infrastructure.Persistence;

namespace WorkTracking.Infrastructure.Services;

public class ProjectService : IProjectService
{
    private readonly AppDbContext _context;
    private readonly IAuditLogService _auditLogService;

    public ProjectService(
        AppDbContext context,
        IAuditLogService auditLogService)
    {
        _context = context;
        _auditLogService = auditLogService;
    }

    public async Task<List<ProjectDto>> GetAllAsync()
    {
        return await _context.Projects
            .AsNoTracking()
            .Include(p => p.Manager)
            .Select(p => new ProjectDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                ManagerId = p.ManagerId,
                ManagerName = p.Manager.FirstName + " " + p.Manager.LastName,
                StartDate = p.StartDate,
                EndDate = p.EndDate,
                Status = p.Status.ToString(),
                IsActive = p.IsActive
            })
            .ToListAsync();
    }

    public async Task<ProjectDto?> GetByIdAsync(int id)
    {
        return await _context.Projects
            .AsNoTracking()
            .Include(p => p.Manager)
            .Where(p => p.Id == id)
            .Select(p => new ProjectDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                ManagerId = p.ManagerId,
                ManagerName = p.Manager.FirstName + " " + p.Manager.LastName,
                StartDate = p.StartDate,
                EndDate = p.EndDate,
                Status = p.Status.ToString(),
                IsActive = p.IsActive
            })
            .FirstOrDefaultAsync();
    }

    public async Task<ProjectDto> CreateAsync(CreateProjectRequest request)
    {
        var manager = await _context.Users
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Id == request.ManagerId);

        if (manager is null)
            throw new InvalidOperationException("Yönetici bulunamadı.");

        if (manager.Role.Name != "Manager")
            throw new InvalidOperationException(
                "Proje yöneticisi olarak sadece Manager rolündeki kullanıcı atanabilir.");

        var project = new Project
        {
            Name = request.Name,
            Description = request.Description,
            ManagerId = request.ManagerId,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            Status = ProjectStatus.Planning,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        _context.Projects.Add(project);
        await _context.SaveChangesAsync();

        await _auditLogService.CreateAsync(
            null,
            "Create",
            "Project",
            project.Id,
            $"Yeni proje oluşturuldu: {project.Name}"
        );

        return (await GetByIdAsync(project.Id))!;
    }

    public async Task<ProjectDto?> UpdateAsync(
        int id,
        UpdateProjectRequest request)
    {
        var project = await _context.Projects.FindAsync(id);

        if (project is null)
            return null;

        var manager = await _context.Users
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Id == request.ManagerId);

        if (manager is null)
            throw new InvalidOperationException("Yönetici bulunamadı.");

        if (manager.Role.Name != "Manager")
            throw new InvalidOperationException(
                "Proje yöneticisi olarak sadece Manager rolündeki kullanıcı atanabilir.");

        project.Name = request.Name;
        project.Description = request.Description;
        project.ManagerId = request.ManagerId;
        project.StartDate = request.StartDate;
        project.EndDate = request.EndDate;
        project.IsActive = request.IsActive;

        await _context.SaveChangesAsync();

        return await GetByIdAsync(id);
    }
}