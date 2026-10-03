using FluentValidation;
using WorkTracking.Application.DTOs.Tasks;

namespace WorkTracking.Application.Validators;

public class CreateTaskRequestValidator : AbstractValidator<CreateTaskRequest>
{
    public CreateTaskRequestValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty()
            .WithMessage("Görev başlığı boş olamaz.")
            .MaximumLength(200)
            .WithMessage("Görev başlığı en fazla 200 karakter olabilir.");

        RuleFor(x => x.ProjectId)
            .GreaterThan(0)
            .WithMessage("Geçerli bir proje seçilmelidir.");

        RuleFor(x => x.AssignedUserId)
            .GreaterThan(0)
            .WithMessage("Geçerli bir çalışan seçilmelidir.");

        RuleFor(x => x.Priority)
            .InclusiveBetween(1, 4)
            .WithMessage("Görev önceliği 1 ile 4 arasında olmalıdır.");

        RuleFor(x => x.DueDate)
            .GreaterThan(DateTime.UtcNow)
            .When(x => x.DueDate.HasValue)
            .WithMessage("Son teslim tarihi ileri bir tarih olmalıdır.");
    }
}