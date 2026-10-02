using Microsoft.EntityFrameworkCore;
using WorkTracking.Application.DTOs.Notifications;
using WorkTracking.Application.Interfaces;
using WorkTracking.Domain.Entities;
using WorkTracking.Infrastructure.Persistence;

namespace WorkTracking.Infrastructure.Services;

public class NotificationService : INotificationService
{
    private readonly AppDbContext _context;

    public NotificationService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<NotificationDto>> GetByUserIdAsync(int userId)
    {
        return await _context.Notifications
            .AsNoTracking()
            .Where(n => n.UserId == userId)
            .OrderByDescending(n => n.CreatedAt)
            .Select(n => new NotificationDto
            {
                Id = n.Id,
                UserId = n.UserId,
                Title = n.Title,
                Message = n.Message,
                IsRead = n.IsRead,
                CreatedAt = n.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<NotificationDto> CreateAsync(
        CreateNotificationRequest request)
    {
        var userExists = await _context.Users
            .AnyAsync(u => u.Id == request.UserId);

        if (!userExists)
            throw new InvalidOperationException("Kullanıcı bulunamadı.");

        if (string.IsNullOrWhiteSpace(request.Title))
            throw new InvalidOperationException("Bildirim başlığı boş olamaz.");

        if (string.IsNullOrWhiteSpace(request.Message))
            throw new InvalidOperationException("Bildirim mesajı boş olamaz.");

        var notification = new Notification
        {
            UserId = request.UserId,
            Title = request.Title.Trim(),
            Message = request.Message.Trim(),
            IsRead = false,
            CreatedAt = DateTime.UtcNow
        };

        _context.Notifications.Add(notification);
        await _context.SaveChangesAsync();

        return new NotificationDto
        {
            Id = notification.Id,
            UserId = notification.UserId,
            Title = notification.Title,
            Message = notification.Message,
            IsRead = notification.IsRead,
            CreatedAt = notification.CreatedAt
        };
    }

    public async Task<bool> MarkAsReadAsync(
        int notificationId,
        int userId)
    {
        var notification = await _context.Notifications
            .FirstOrDefaultAsync(n =>
                n.Id == notificationId &&
                n.UserId == userId);

        if (notification is null)
            return false;

        notification.IsRead = true;

        await _context.SaveChangesAsync();

        return true;
    }
}