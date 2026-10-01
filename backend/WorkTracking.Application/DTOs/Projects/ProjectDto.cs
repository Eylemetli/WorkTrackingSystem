namespace WorkTracking.Application.DTOs.Projects;

public class ProjectDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }

    public int ManagerId { get; set; }
    public string ManagerName { get; set; } = string.Empty;

    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }

    public string Status { get; set; } = string.Empty;
    public bool IsActive { get; set; }
}