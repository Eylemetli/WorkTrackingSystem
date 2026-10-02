using WorkTracking.Application.DTOs.AuditLogs;

namespace WorkTracking.Application.Interfaces;

public interface IAuditLogService
{
    Task CreateAsync(
        int? userId,
        string action,
        string entityName,
        int? entityId,
        string? description);

    Task<List<AuditLogDto>> GetAllAsync();
}