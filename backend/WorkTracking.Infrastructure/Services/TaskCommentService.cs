using Microsoft.EntityFrameworkCore;
using WorkTracking.Application.DTOs.TaskComments;
using WorkTracking.Application.Interfaces;
using WorkTracking.Domain.Entities;
using WorkTracking.Infrastructure.Persistence;

namespace WorkTracking.Infrastructure.Services;

public class TaskCommentService : ITaskCommentService
{
    private readonly AppDbContext _context;

    public TaskCommentService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<TaskCommentDto>> GetByTaskIdAsync(int taskId)
    {
        return await _context.TaskComments
            .AsNoTracking()
            .Where(tc => tc.TaskId == taskId)
            .Include(tc => tc.User)
            .OrderBy(tc => tc.CreatedAt)
            .Select(tc => new TaskCommentDto
            {
                Id = tc.Id,
                TaskId = tc.TaskId,
                UserId = tc.UserId,
                UserName = tc.User.FirstName + " " + tc.User.LastName,
                Comment = tc.Comment,
                CreatedAt = tc.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<TaskCommentDto> CreateAsync(
        int taskId,
        int userId,
        CreateTaskCommentRequest request)
    {
        var task = await _context.Tasks
            .Include(t => t.Project)
            .FirstOrDefaultAsync(t => t.Id == taskId);

        if (task is null)
            throw new InvalidOperationException("Görev bulunamadı.");

        var user = await _context.Users
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user is null)
            throw new InvalidOperationException("Kullanıcı bulunamadı.");

        var hasAccess =
            user.Role.Name == "Admin" ||
            task.Project.ManagerId == userId ||
            task.AssignedUserId == userId;

        if (!hasAccess)
            throw new UnauthorizedAccessException(
                "Bu göreve yorum yapma yetkiniz yok.");

        if (string.IsNullOrWhiteSpace(request.Comment))
            throw new InvalidOperationException(
                "Yorum boş olamaz.");

        var comment = new TaskComment
        {
            TaskId = taskId,
            UserId = userId,
            Comment = request.Comment.Trim(),
            CreatedAt = DateTime.UtcNow
        };

        _context.TaskComments.Add(comment);
        await _context.SaveChangesAsync();

        return new TaskCommentDto
        {
            Id = comment.Id,
            TaskId = comment.TaskId,
            UserId = user.Id,
            UserName = user.FirstName + " " + user.LastName,
            Comment = comment.Comment,
            CreatedAt = comment.CreatedAt
        };
    }
}