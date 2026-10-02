using Microsoft.EntityFrameworkCore;
using WorkTracking.Application.DTOs.Users;
using WorkTracking.Application.Interfaces;
using WorkTracking.Infrastructure.Persistence;

namespace WorkTracking.Infrastructure.Services;

public class UserService : IUserService
{
    private readonly AppDbContext _context;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IAuditLogService _auditLogService;

    public UserService(
        AppDbContext context,
        IPasswordHasher passwordHasher,
        IAuditLogService auditLogService)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _auditLogService = auditLogService;
    }

    public async Task<List<UserDto>> GetAllAsync()
    {
        return await _context.Users
            .AsNoTracking()
            .Include(u => u.Role)
            .Include(u => u.Department)
            .Select(u => new UserDto
            {
                Id = u.Id,
                FirstName = u.FirstName,
                LastName = u.LastName,
                Email = u.Email,
                Role = u.Role.Name,
                Department = u.Department != null
                    ? u.Department.Name
                    : null,
                IsActive = u.IsActive,
                CreatedAt = u.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<UserDto?> GetByIdAsync(int id)
    {
        return await _context.Users
            .AsNoTracking()
            .Include(u => u.Role)
            .Include(u => u.Department)
            .Where(u => u.Id == id)
            .Select(u => new UserDto
            {
                Id = u.Id,
                FirstName = u.FirstName,
                LastName = u.LastName,
                Email = u.Email,
                Role = u.Role.Name,
                Department = u.Department != null
                    ? u.Department.Name
                    : null,
                IsActive = u.IsActive,
                CreatedAt = u.CreatedAt
            })
            .FirstOrDefaultAsync();
    }

    public async Task<UserDto> CreateAsync(CreateUserRequest request)
    {
        var email = request.Email.Trim().ToLower();

        if (await _context.Users.AnyAsync(u => u.Email == email))
            throw new InvalidOperationException("Bu email adresi zaten kullanılıyor.");

        var user = new WorkTracking.Domain.Entities.User
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = email,
            PasswordHash = _passwordHasher.Hash(request.Password),
            RoleId = request.RoleId,
            DepartmentId = request.DepartmentId,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        await _auditLogService.CreateAsync(
    null,
    "Create",
    "User",
    user.Id,
    $"Yeni kullanıcı oluşturuldu: {user.Email}"
);

        return (await GetByIdAsync(user.Id))!;
    }

    public async Task<UserDto?> UpdateAsync(int id, UpdateUserRequest request)
    {
        var user = await _context.Users.FindAsync(id);

        if (user is null)
            return null;

        user.FirstName = request.FirstName;
        user.LastName = request.LastName;
        user.RoleId = request.RoleId;
        user.DepartmentId = request.DepartmentId;
        user.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return await GetByIdAsync(id);
    }

    public async Task<bool> ToggleActiveAsync(int id)
    {
        var user = await _context.Users.FindAsync(id);

        if (user is null)
            return false;

        user.IsActive = !user.IsActive;
        user.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return true;
    }
}