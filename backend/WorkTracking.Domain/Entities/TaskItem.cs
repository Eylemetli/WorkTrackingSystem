namespace WorkTracking.Domain.Entities;

using WorkTracking.Domain.Enums;

public class TaskItem
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }

    public int ProjectId { get; set; }
    public Project Project { get; set; } = null!;

    public int AssignedUserId { get; set; }
    public User AssignedUser { get; set; } = null!;

    public int CreatedByUserId { get; set; }
    public User CreatedByUser { get; set; } = null!;

    public TaskPriority Priority { get; set; } = TaskPriority.Medium;
    public TaskStatus Status { get; set; } = TaskStatus.Pending;

    public DateTime? DueDate { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}