namespace WorkTracking.Application.DTOs.WorkLogs;

public class WorkLogDto
{
    public int Id { get; set; }

    public int TaskId { get; set; }
    public string TaskTitle { get; set; } = string.Empty;

    public int UserId { get; set; }
    public string UserName { get; set; } = string.Empty;

    public DateTime WorkDate { get; set; }

    public decimal DurationHours { get; set; }

    public string Description { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }
}