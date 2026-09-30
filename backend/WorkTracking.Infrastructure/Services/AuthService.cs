using Microsoft.EntityFrameworkCore;
using WorkTracking.Application.DTOs.Auth;
using WorkTracking.Application.Interfaces;
using WorkTracking.Domain.Entities;
using WorkTracking.Infrastructure.Persistence;

namespace WorkTracking.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ITokenService _tokenService;

    public AuthService(
        AppDbContext context,
        IPasswordHasher passwordHasher,
        ITokenService tokenService)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _tokenService = tokenService;
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        var existingUser = await _context.Users
            .AnyAsync(u => u.Email == request.Email);

        if (existingUser)
            throw new InvalidOperationException("Bu email adresi zaten kullanılıyor.");

        var role = await _context.Roles
            .FirstOrDefaultAsync(r => r.Id == request.RoleId);

        if (role is null)
            throw new InvalidOperationException("Geçersiz rol.");

        if (request.DepartmentId.HasValue)
        {
            var departmentExists = await _context.Departments
                .AnyAsync(d => d.Id == request.DepartmentId.Value);

            if (!departmentExists)
                throw new InvalidOperationException("Geçersiz departman.");
        }

        var user = new User
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email.Trim().ToLower(),
            PasswordHash = _passwordHasher.Hash(request.Password),
            RoleId = request.RoleId,
            DepartmentId = request.DepartmentId,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        user.Role = role;

        var token = _tokenService.CreateToken(user);

        return new AuthResponse
        {
            UserId = user.Id,
            FullName = $"{user.FirstName} {user.LastName}",
            Email = user.Email,
            Role = role.Name,
            Token = token,
            ExpiresAt = DateTime.UtcNow.AddHours(2)
        };
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var email = request.Email.Trim().ToLower();

        var user = await _context.Users
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Email == email);

        if (user is null)
            throw new UnauthorizedAccessException("Email veya şifre hatalı.");

        if (!user.IsActive)
            throw new UnauthorizedAccessException("Kullanıcı hesabı aktif değil.");

        var isPasswordValid = _passwordHasher.Verify(
            request.Password,
            user.PasswordHash);

        if (!isPasswordValid)
            throw new UnauthorizedAccessException("Email veya şifre hatalı.");

        var token = _tokenService.CreateToken(user);

        return new AuthResponse
        {
            UserId = user.Id,
            FullName = $"{user.FirstName} {user.LastName}",
            Email = user.Email,
            Role = user.Role.Name,
            Token = token,
            ExpiresAt = DateTime.UtcNow.AddHours(2)
        };
    }
}