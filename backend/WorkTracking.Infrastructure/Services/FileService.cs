using Microsoft.EntityFrameworkCore;
using WorkTracking.Application.DTOs.Files;
using WorkTracking.Application.Interfaces;
using WorkTracking.Domain.Entities;
using WorkTracking.Infrastructure.Persistence;

namespace WorkTracking.Infrastructure.Services;

public class FileService : IFileService
{
    private readonly AppDbContext _context;

    public FileService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<FileAttachmentDto>> GetByTaskIdAsync(int taskId)
    {
        return await _context.Files
            .AsNoTracking()
            .Where(f => f.TaskId == taskId)
            .Include(f => f.User)
            .OrderByDescending(f => f.UploadedAt)
            .Select(f => new FileAttachmentDto
            {
                Id = f.Id,
                TaskId = f.TaskId,
                UserId = f.UserId,
                UserName = f.User.FirstName + " " + f.User.LastName,
                FileName = f.FileName,
                FilePath = f.FilePath,
                UploadedAt = f.UploadedAt
            })
            .ToListAsync();
    }

    public async Task<FileAttachmentDto> SaveAsync(
        int taskId,
        int userId,
        string fileName,
        string filePath)
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
                "Bu göreve dosya yükleme yetkiniz yok.");

        var attachment = new FileAttachment
        {
            TaskId = taskId,
            UserId = userId,
            FileName = fileName,
            FilePath = filePath,
            UploadedAt = DateTime.UtcNow
        };

        _context.Files.Add(attachment);
        await _context.SaveChangesAsync();

        return new FileAttachmentDto
        {
            Id = attachment.Id,
            TaskId = attachment.TaskId,
            UserId = user.Id,
            UserName = user.FirstName + " " + user.LastName,
            FileName = attachment.FileName,
            FilePath = attachment.FilePath,
            UploadedAt = attachment.UploadedAt
        };
    }
}