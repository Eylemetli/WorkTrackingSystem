namespace WorkTracking.Application.DTOs.Dashboard;

public class AdminDashboardDto
{
    public int TotalUsers { get; set; }
    public int ActiveUsers { get; set; }

    public int TotalProjects { get; set; }
    public int ActiveProjects { get; set; }

    public int CompletedTasks { get; set; }
    public int OverdueTasks { get; set; }
}