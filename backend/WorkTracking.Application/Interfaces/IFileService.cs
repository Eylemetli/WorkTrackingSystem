using WorkTracking.Application.DTOs.Files;

namespace WorkTracking.Application.Interfaces;

public interface IFileService
{
    Task<List<FileAttachmentDto>> GetByTaskIdAsync(int taskId);

    Task<FileAttachmentDto> SaveAsync(
        int taskId,
        int userId,
        string fileName,
        string filePath);
}