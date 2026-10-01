using Microsoft.EntityFrameworkCore;
using WorkTracking.Application.DTOs.Tasks;
using WorkTracking.Application.Interfaces;
using WorkTracking.Domain.Entities;
using WorkTracking.Domain.Enums;
using WorkTracking.Infrastructure.Persistence;

namespace WorkTracking.Infrastructure.Services;

public class TaskService : ITaskService
{
    private readonly AppDbContext _context;

    public TaskService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<TaskDto>> GetAllAsync()
    {
        return await _context.Tasks
            .AsNoTracking()
            .Include(t => t.Project)
            .Include(t => t.AssignedUser)
            .Select(t => new TaskDto
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description,
                ProjectId = t.ProjectId,
                ProjectName = t.Project.Name,
                AssignedUserId = t.AssignedUserId,
                AssignedUserName = t.AssignedUser.FirstName + " " + t.AssignedUser.LastName,
                Priority = t.Priority.ToString(),
                Status = t.Status.ToString(),
                DueDate = t.DueDate,
                CreatedAt = t.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<TaskDto?> GetByIdAsync(int id)
    {
        return await _context.Tasks
            .AsNoTracking()
            .Include(t => t.Project)
            .Include(t => t.AssignedUser)
            .Where(t => t.Id == id)
            .Select(t => new TaskDto
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description,
                ProjectId = t.ProjectId,
                ProjectName = t.Project.Name,
                AssignedUserId = t.AssignedUserId,
                AssignedUserName = t.AssignedUser.FirstName + " " + t.AssignedUser.LastName,
                Priority = t.Priority.ToString(),
                Status = t.Status.ToString(),
                DueDate = t.DueDate,
                CreatedAt = t.CreatedAt
            })
            .FirstOrDefaultAsync();
    }

    public async Task<TaskDto> CreateAsync(
        CreateTaskRequest request,
        int createdByUserId)
    {
        var project = await _context.Projects
            .FirstOrDefaultAsync(p => p.Id == request.ProjectId);

        if (project is null)
            throw new InvalidOperationException("Proje bulunamadı.");

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == request.AssignedUserId);

        if (user is null)
            throw new InvalidOperationException("Çalışan bulunamadı.");

        var isProjectMember = await _context.ProjectMembers
            .AnyAsync(pm =>
                pm.ProjectId == request.ProjectId &&
                pm.UserId == request.AssignedUserId);

        if (!isProjectMember)
            throw new InvalidOperationException(
                "Görev atanacak kullanıcı bu projenin üyesi değil.");

        if (!Enum.IsDefined(typeof(TaskPriority), request.Priority))
            throw new InvalidOperationException("Geçersiz görev önceliği.");

        var task = new TaskItem
        {
            Title = request.Title,
            Description = request.Description,
            ProjectId = request.ProjectId,
            AssignedUserId = request.AssignedUserId,
            CreatedByUserId = createdByUserId,
            Priority = (TaskPriority)request.Priority,
            Status = WorkTracking.Domain.Enums.TaskStatus.Pending,
            DueDate = request.DueDate,
            CreatedAt = DateTime.UtcNow
        };

        _context.Tasks.Add(task);
        await _context.SaveChangesAsync();

        return (await GetByIdAsync(task.Id))!;
    }

    public async Task<TaskDto?> UpdateAsync(
        int id,
        UpdateTaskRequest request)
    {
        var task = await _context.Tasks.FindAsync(id);

        if (task is null)
            return null;

        var isProjectMember = await _context.ProjectMembers
            .AnyAsync(pm =>
                pm.ProjectId == task.ProjectId &&
                pm.UserId == request.AssignedUserId);

        if (!isProjectMember)
            throw new InvalidOperationException(
                "Görev atanacak kullanıcı bu projenin üyesi değil.");

        if (!Enum.IsDefined(typeof(TaskPriority), request.Priority))
            throw new InvalidOperationException("Geçersiz görev önceliği.");

        if (!Enum.IsDefined(
            typeof(WorkTracking.Domain.Enums.TaskStatus),
            request.Status))
            throw new InvalidOperationException("Geçersiz görev durumu.");

        task.Title = request.Title;
        task.Description = request.Description;
        task.AssignedUserId = request.AssignedUserId;
        task.Priority = (TaskPriority)request.Priority;
        task.Status = (WorkTracking.Domain.Enums.TaskStatus)request.Status;
        task.DueDate = request.DueDate;
        task.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return await GetByIdAsync(id);
    }
}