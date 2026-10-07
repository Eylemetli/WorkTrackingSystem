using Microsoft.EntityFrameworkCore;
using WorkTracking.Application.DTOs.Dashboard;
using WorkTracking.Application.Interfaces;
using WorkTracking.Domain.Enums;
using WorkTracking.Infrastructure.Persistence;

namespace WorkTracking.Infrastructure.Services;

public class DashboardService : IDashboardService
{
    private readonly AppDbContext _context;

    public DashboardService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<AdminDashboardDto> GetAdminDashboardAsync()
    {
        var now = DateTime.UtcNow;

        return new AdminDashboardDto
        {
            TotalUsers = await _context.Users.CountAsync(),

            ActiveUsers = await _context.Users
                .CountAsync(u => u.IsActive),

            TotalProjects = await _context.Projects.CountAsync(),

            ActiveProjects = await _context.Projects
                .CountAsync(p => p.IsActive),

            CompletedTasks = await _context.Tasks
                .CountAsync(t => t.Status == WorkTracking.Domain.Enums.TaskStatus.Completed),

            OverdueTasks = await _context.Tasks
                .CountAsync(t =>
                    t.DueDate.HasValue &&
                    t.DueDate.Value < now &&
                    t.Status != WorkTracking.Domain.Enums.TaskStatus.Completed)
        };
    }
}