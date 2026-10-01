namespace WorkTracking.Application.DTOs.Tasks;

public class UpdateTaskRequest
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }

    public int AssignedUserId { get; set; }

    public int Priority { get; set; }
    public int Status { get; set; }

    public DateTime? DueDate { get; set; }
}