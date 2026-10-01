using Microsoft.EntityFrameworkCore;
using WorkTracking.Application.DTOs.Departments;
using WorkTracking.Application.Interfaces;
using WorkTracking.Domain.Entities;
using WorkTracking.Infrastructure.Persistence;

namespace WorkTracking.Infrastructure.Services;

public class DepartmentService : IDepartmentService
{
    private readonly AppDbContext _context;

    public DepartmentService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<DepartmentDto>> GetAllAsync()
    {
        return await _context.Departments
            .AsNoTracking()
            .Select(d => new DepartmentDto
            {
                Id = d.Id,
                Name = d.Name,
                Description = d.Description,
                IsActive = d.IsActive
            })
            .ToListAsync();
    }

    public async Task<DepartmentDto?> GetByIdAsync(int id)
    {
        return await _context.Departments
            .AsNoTracking()
            .Where(d => d.Id == id)
            .Select(d => new DepartmentDto
            {
                Id = d.Id,
                Name = d.Name,
                Description = d.Description,
                IsActive = d.IsActive
            })
            .FirstOrDefaultAsync();
    }

    public async Task<DepartmentDto> CreateAsync(CreateDepartmentRequest request)
    {
        var exists = await _context.Departments
            .AnyAsync(d => d.Name == request.Name);

        if (exists)
            throw new InvalidOperationException("Bu departman zaten mevcut.");

        var department = new Department
        {
            Name = request.Name,
            Description = request.Description,
            IsActive = true
        };

        _context.Departments.Add(department);
        await _context.SaveChangesAsync();

        return new DepartmentDto
        {
            Id = department.Id,
            Name = department.Name,
            Description = department.Description,
            IsActive = department.IsActive
        };
    }

    public async Task<DepartmentDto?> UpdateAsync(
        int id,
        UpdateDepartmentRequest request)
    {
        var department = await _context.Departments.FindAsync(id);

        if (department is null)
            return null;

        department.Name = request.Name;
        department.Description = request.Description;
        department.IsActive = request.IsActive;

        await _context.SaveChangesAsync();

        return new DepartmentDto
        {
            Id = department.Id,
            Name = department.Name,
            Description = department.Description,
            IsActive = department.IsActive
        };
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var department = await _context.Departments
            .Include(d => d.Users)
            .FirstOrDefaultAsync(d => d.Id == id);

        if (department is null)
            return false;

        if (department.Users.Any())
            throw new InvalidOperationException(
                "Bu departmana bağlı kullanıcılar olduğu için silinemez.");

        _context.Departments.Remove(department);
        await _context.SaveChangesAsync();

        return true;
    }
}