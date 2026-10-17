using WorkTracking.Application.DTOs.Reports;

namespace WorkTracking.Application.Interfaces;

public interface IReportService
{
    Task<AdminReportDto> GetAdminReportAsync();
}