namespace WorkTracking.Application.DTOs.Reports;

public class AdminReportDto
{
    public int TotalProjects { get; set; }
    public int ActiveProjects { get; set; }
    public int CompletedProjects { get; set; }

    public int TotalTasks { get; set; }
    public int PendingTasks { get; set; }
    public int InProgressTasks { get; set; }
    public int InReviewTasks { get; set; }
    public int CompletedTasks { get; set; }
    public int OverdueTasks { get; set; }

    public double CompletionRate { get; set; }
}