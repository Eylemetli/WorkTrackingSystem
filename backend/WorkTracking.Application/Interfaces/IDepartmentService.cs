using WorkTracking.Application.DTOs.Departments;

namespace WorkTracking.Application.Interfaces;

public interface IDepartmentService
{
    Task<List<DepartmentDto>> GetAllAsync();
    Task<DepartmentDto?> GetByIdAsync(int id);
    Task<DepartmentDto> CreateAsync(CreateDepartmentRequest request);
    Task<DepartmentDto?> UpdateAsync(int id, UpdateDepartmentRequest request);
    Task<bool> DeleteAsync(int id);
}