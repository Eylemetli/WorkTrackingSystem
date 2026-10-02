namespace WorkTracking.Application.DTOs.WorkLogs;

public class CreateWorkLogRequest
{
    public DateTime WorkDate { get; set; }

    public decimal DurationHours { get; set; }

    public string Description { get; set; } = string.Empty;
}