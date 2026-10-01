using WorkTracking.Application.DTOs.Tasks;

namespace WorkTracking.Application.Interfaces;

public interface ITaskService
{
    Task<List<TaskDto>> GetAllAsync();
    Task<TaskDto?> GetByIdAsync(int id);

    Task<TaskDto> CreateAsync(
        CreateTaskRequest request,
        int createdByUserId);

    Task<TaskDto?> UpdateAsync(
        int id,
        UpdateTaskRequest request);
}