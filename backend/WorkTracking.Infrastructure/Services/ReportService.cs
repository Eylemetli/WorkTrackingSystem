using Microsoft.EntityFrameworkCore;
using WorkTracking.Application.DTOs.Reports;
using WorkTracking.Application.Interfaces;
using WorkTracking.Infrastructure.Persistence;
using ProjectStatus = WorkTracking.Domain.Enums.ProjectStatus;
using TaskStatus = WorkTracking.Domain.Enums.TaskStatus;

namespace WorkTracking.Infrastructure.Services;

public class ReportService : IReportService
{
    private readonly AppDbContext _context;

    public ReportService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<AdminReportDto> GetAdminReportAsync()
    {
        var totalProjects = await _context.Projects.CountAsync();

        var activeProjects = await _context.Projects
            .CountAsync(p => p.Status == ProjectStatus.Active);

        var completedProjects = await _context.Projects
            .CountAsync(p => p.Status == ProjectStatus.Completed);

        var totalTasks = await _context.Tasks.CountAsync();

        var pendingTasks = await _context.Tasks
            .CountAsync(t => t.Status == TaskStatus.Pending);

        var inProgressTasks = await _context.Tasks
            .CountAsync(t => t.Status == TaskStatus.InProgress);

        var inReviewTasks = await _context.Tasks
            .CountAsync(t => t.Status == TaskStatus.InReview);

        var completedTasks = await _context.Tasks
            .CountAsync(t => t.Status == TaskStatus.Completed);

        var overdueTasks = await _context.Tasks
            .CountAsync(t =>
                t.DueDate.HasValue &&
                t.DueDate.Value < DateTime.UtcNow &&
                t.Status != TaskStatus.Completed);

        var completionRate = totalTasks == 0
            ? 0
            : Math.Round((double)completedTasks / totalTasks * 100, 2);

        return new AdminReportDto
        {
            TotalProjects = totalProjects,
            ActiveProjects = activeProjects,
            CompletedProjects = completedProjects,
            TotalTasks = totalTasks,
            PendingTasks = pendingTasks,
            InProgressTasks = inProgressTasks,
            InReviewTasks = inReviewTasks,
            CompletedTasks = completedTasks,
            OverdueTasks = overdueTasks,
            CompletionRate = completionRate
        };
    }
}