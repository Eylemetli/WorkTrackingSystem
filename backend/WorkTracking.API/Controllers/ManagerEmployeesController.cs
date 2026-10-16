using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WorkTracking.Application.Interfaces;

namespace WorkTracking.API.Controllers;

[ApiController]
[Route("api/manager/employees")]
[Authorize(Policy = "ManagerOnly")]
public class ManagerEmployeesController : ControllerBase
{
    private readonly IUserService _userService;

    public ManagerEmployeesController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet]
    public async Task<IActionResult> GetEmployees()
    {
        var users = await _userService.GetAllAsync();

        var employees = users
            .Where(u => u.Role == "Employee" && u.IsActive)
            .ToList();

        return Ok(employees);
    }
}