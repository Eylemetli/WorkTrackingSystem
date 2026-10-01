using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WorkTracking.API.Controllers;

[ApiController]
[Route("api/test-authorization")]
public class TestAuthorizationController : ControllerBase
{
    [Authorize]
    [HttpGet("authenticated")]
    public IActionResult Authenticated()
    {
        return Ok(new
        {
            message = "Giriş yapmış kullanıcı erişebilir."
        });
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpGet("admin")]
    public IActionResult Admin()
    {
        return Ok(new
        {
            message = "Sadece Admin erişebilir."
        });
    }

    [Authorize(Policy = "ManagerOnly")]
    [HttpGet("manager")]
    public IActionResult Manager()
    {
        return Ok(new
        {
            message = "Sadece Manager erişebilir."
        });
    }

    [Authorize(Policy = "AdminOrManager")]
    [HttpGet("admin-or-manager")]
    public IActionResult AdminOrManager()
    {
        return Ok(new
        {
            message = "Admin veya Manager erişebilir."
        });
    }

    [Authorize(Roles = "Employee")]
    [HttpGet("employee")]
    public IActionResult Employee()
    {
        return Ok(new
        {
            message = "Sadece Employee erişebilir."
        });
    }
}