namespace WorkTracking.Application.DTOs.Tasks;

public class CreateTaskRequest
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }

    public int ProjectId { get; set; }
    public int AssignedUserId { get; set; }

    public int Priority { get; set; }

    public DateTime? DueDate { get; set; }
}