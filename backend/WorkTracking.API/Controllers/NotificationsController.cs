using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WorkTracking.Application.Interfaces;

namespace WorkTracking.API.Controllers;

[ApiController]
[Route("api/notifications")]
[Authorize]
public class NotificationsController : ControllerBase
{
    private readonly INotificationService _notificationService;

    public NotificationsController(
        INotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    [HttpGet]
    public async Task<IActionResult> GetMyNotifications()
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier)
                          ?? User.FindFirstValue("sub");

        if (!int.TryParse(userIdValue, out var userId))
        {
            return Unauthorized(new
            {
                message = "Kullanıcı bilgisi alınamadı."
            });
        }

        var notifications =
            await _notificationService.GetByUserIdAsync(userId);

        return Ok(notifications);
    }

    [HttpPatch("{id:int}/read")]
    public async Task<IActionResult> MarkAsRead(int id)
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier)
                          ?? User.FindFirstValue("sub");

        if (!int.TryParse(userIdValue, out var userId))
        {
            return Unauthorized(new
            {
                message = "Kullanıcı bilgisi alınamadı."
            });
        }

        var result = await _notificationService
            .MarkAsReadAsync(id, userId);

        if (!result)
        {
            return NotFound(new
            {
                message = "Bildirim bulunamadı."
            });
        }

        return Ok(new
        {
            message = "Bildirim okundu olarak işaretlendi."
        });
    }
}