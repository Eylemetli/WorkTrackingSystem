using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WorkTracking.Application.Interfaces;

namespace WorkTracking.API.Controllers;

[ApiController]
[Route("api/manager/dashboard")]
[Authorize(Policy = "ManagerOnly")]
public class ManagerDashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;

    public ManagerDashboardController(IDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    [HttpGet]
    public async Task<IActionResult> GetDashboard()
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrWhiteSpace(userIdValue))
        {
            return Unauthorized();
        }

        var managerId = int.Parse(userIdValue);

        var dashboard =
            await _dashboardService.GetManagerDashboardAsync(managerId);

        return Ok(dashboard);
    }
}