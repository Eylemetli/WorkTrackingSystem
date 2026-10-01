using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WorkTracking.Application.DTOs.Departments;
using WorkTracking.Application.Interfaces;

namespace WorkTracking.API.Controllers;

[ApiController]
[Route("api/admin/departments")]
[Authorize(Policy = "AdminOnly")]
public class AdminDepartmentsController : ControllerBase
{
    private readonly IDepartmentService _departmentService;

    public AdminDepartmentsController(IDepartmentService departmentService)
    {
        _departmentService = departmentService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _departmentService.GetAllAsync());
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var department = await _departmentService.GetByIdAsync(id);

        if (department is null)
            return NotFound(new { message = "Departman bulunamadı." });

        return Ok(department);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateDepartmentRequest request)
    {
        try
        {
            var department = await _departmentService.CreateAsync(request);

            return CreatedAtAction(
                nameof(GetById),
                new { id = department.Id },
                department);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(
        int id,
        UpdateDepartmentRequest request)
    {
        var department = await _departmentService.UpdateAsync(id, request);

        if (department is null)
            return NotFound(new { message = "Departman bulunamadı." });

        return Ok(department);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var result = await _departmentService.DeleteAsync(id);

            if (!result)
                return NotFound(new { message = "Departman bulunamadı." });

            return Ok(new { message = "Departman silindi." });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}