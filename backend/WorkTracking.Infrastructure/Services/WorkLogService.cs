using Microsoft.EntityFrameworkCore;
using WorkTracking.Application.DTOs.WorkLogs;
using WorkTracking.Application.Interfaces;
using WorkTracking.Domain.Entities;
using WorkTracking.Infrastructure.Persistence;

namespace WorkTracking.Infrastructure.Services;

public class WorkLogService : IWorkLogService
{
    private readonly AppDbContext _context;

    public WorkLogService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<WorkLogDto>> GetByTaskIdAsync(int taskId)
    {
        return await _context.WorkLogs
            .AsNoTracking()
            .Where(w => w.TaskId == taskId)
            .Include(w => w.Task)
            .Include(w => w.User)
            .OrderByDescending(w => w.WorkDate)
            .Select(w => new WorkLogDto
            {
                Id = w.Id,
                TaskId = w.TaskId,
                TaskTitle = w.Task.Title,
                UserId = w.UserId,
                UserName = w.User.FirstName + " " + w.User.LastName,
                WorkDate = w.WorkDate,
                DurationHours = w.DurationHours,
                Description = w.Description,
                CreatedAt = w.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<WorkLogDto> CreateAsync(
        int taskId,
        int userId,
        CreateWorkLogRequest request)
    {
        var task = await _context.Tasks
            .FirstOrDefaultAsync(t => t.Id == taskId);

        if (task is null)
            throw new InvalidOperationException("Görev bulunamadı.");

        if (task.AssignedUserId != userId)
            throw new UnauthorizedAccessException(
                "Sadece kendinize atanmış görev için çalışma kaydı ekleyebilirsiniz.");

        if (request.DurationHours <= 0)
            throw new InvalidOperationException(
                "Çalışma süresi 0'dan büyük olmalıdır.");

        if (string.IsNullOrWhiteSpace(request.Description))
            throw new InvalidOperationException(
                "Çalışma açıklaması boş olamaz.");

        var workLog = new WorkLog
        {
            TaskId = taskId,
            UserId = userId,
            WorkDate = request.WorkDate,
            DurationHours = request.DurationHours,
            Description = request.Description.Trim(),
            CreatedAt = DateTime.UtcNow
        };

        _context.WorkLogs.Add(workLog);
        await _context.SaveChangesAsync();

        var user = await _context.Users
            .FirstAsync(u => u.Id == userId);

        return new WorkLogDto
        {
            Id = workLog.Id,
            TaskId = workLog.TaskId,
            TaskTitle = task.Title,
            UserId = workLog.UserId,
            UserName = user.FirstName + " " + user.LastName,
            WorkDate = workLog.WorkDate,
            DurationHours = workLog.DurationHours,
            Description = workLog.Description,
            CreatedAt = workLog.CreatedAt
        };
    }
}