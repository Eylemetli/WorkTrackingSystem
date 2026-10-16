using WorkTracking.Application.DTOs.Dashboard;

namespace WorkTracking.Application.Interfaces;

public interface IDashboardService
{
    Task<AdminDashboardDto> GetAdminDashboardAsync();
    Task<ManagerDashboardDto> GetManagerDashboardAsync(int managerId);
    Task<EmployeeDashboardDto> GetEmployeeDashboardAsync(int employeeId);
}