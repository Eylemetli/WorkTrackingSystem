using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WorkTracking.Application.Interfaces;

namespace WorkTracking.API.Controllers;

[ApiController]
[Route("api/employee/dashboard")]
[Authorize(Policy = "EmployeeOnly")]
public class EmployeeDashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;

    public EmployeeDashboardController(IDashboardService dashboardService)
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

        var employeeId = int.Parse(userIdValue);

        var dashboard =
            await _dashboardService.GetEmployeeDashboardAsync(employeeId);

        return Ok(dashboard);
    }
}