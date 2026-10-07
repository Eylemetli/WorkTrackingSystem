using WorkTracking.Application.DTOs.Dashboard;

namespace WorkTracking.Application.Interfaces;

public interface IDashboardService
{
    Task<AdminDashboardDto> GetAdminDashboardAsync();
}