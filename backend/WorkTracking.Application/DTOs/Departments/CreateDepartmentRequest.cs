namespace WorkTracking.Application.DTOs.Departments;

public class CreateDepartmentRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
}