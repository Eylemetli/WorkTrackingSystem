using WorkTracking.Application.DTOs.WorkLogs;

namespace WorkTracking.Application.Interfaces;

public interface IWorkLogService
{
    Task<List<WorkLogDto>> GetByTaskIdAsync(int taskId);

    Task<WorkLogDto> CreateAsync(
        int taskId,
        int userId,
        CreateWorkLogRequest request);
}