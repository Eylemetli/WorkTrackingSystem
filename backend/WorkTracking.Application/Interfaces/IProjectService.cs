using WorkTracking.Application.DTOs.Projects;

namespace WorkTracking.Application.Interfaces;

public interface IProjectService
{
    Task<List<ProjectDto>> GetAllAsync();
    Task<ProjectDto?> GetByIdAsync(int id);
    Task<ProjectDto> CreateAsync(CreateProjectRequest request);
    Task<ProjectDto?> UpdateAsync(int id, UpdateProjectRequest request);
}