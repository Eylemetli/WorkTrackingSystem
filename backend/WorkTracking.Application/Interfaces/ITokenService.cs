using WorkTracking.Domain.Entities;

namespace WorkTracking.Application.Interfaces;

public interface ITokenService
{
    string CreateToken(User user);
}