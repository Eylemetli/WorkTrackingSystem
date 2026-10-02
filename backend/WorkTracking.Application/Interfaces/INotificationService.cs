using WorkTracking.Application.DTOs.Notifications;

namespace WorkTracking.Application.Interfaces;

public interface INotificationService
{
    Task<List<NotificationDto>> GetByUserIdAsync(int userId);

    Task<NotificationDto> CreateAsync(
        CreateNotificationRequest request);

    Task<bool> MarkAsReadAsync(
        int notificationId,
        int userId);
}