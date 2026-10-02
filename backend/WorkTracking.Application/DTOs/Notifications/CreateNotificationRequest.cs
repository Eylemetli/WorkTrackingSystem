namespace WorkTracking.Application.DTOs.Notifications;

public class CreateNotificationRequest
{
    public int UserId { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Message { get; set; } = string.Empty;
}