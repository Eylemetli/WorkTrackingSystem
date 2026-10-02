using WorkTracking.Application.DTOs.TaskComments;

namespace WorkTracking.Application.Interfaces;

public interface ITaskCommentService
{
    Task<List<TaskCommentDto>> GetByTaskIdAsync(int taskId);

    Task<TaskCommentDto> CreateAsync(
        int taskId,
        int userId,
        CreateTaskCommentRequest request);
}