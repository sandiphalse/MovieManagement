using FluentValidation;
using MovieManagement.API.DTO;
using MovieManagement.Domain.Entities.Enums;

namespace MovieManagement.API.Validators;

public class CreateMovieValidator : AbstractValidator<CreateMovie>
{
    public CreateMovieValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty()
            .WithMessage("Title is required")
            .MaximumLength(200)
            .WithMessage("Title cannot exceed 200 characters");

        RuleFor(x => x.Directors)
            .NotEmpty()
            .WithMessage("Directors is required")
            .MaximumLength(100)
            .WithMessage("Directors cannot exceed 100 characters");

        RuleFor(x => x.Actors)
            .NotEmpty()
            .WithMessage("At least one actor is required");

        RuleFor(x => x.ReleaseDate)
          .NotEmpty()
          .WithMessage("Release date is required")
          .Must(BeAValidDate)
          .WithMessage("Release date must be between 1900 and 10 years from today");


        RuleFor(x => x.Runtime)
            .NotEmpty()
            .WithMessage("Runtime is required")
            .Matches(@"^\d{2}:\d{2}:\d{2}$")
            .WithMessage("Runtime must be in HH:mm:ss format");

        RuleFor(x => x.Genre)
            .NotEmpty()
            .WithMessage("Genre is required")
            .Must(BeValidGenre)
            .WithMessage("Invalid genre");

        RuleFor(x => x.Rating)
            .InclusiveBetween(0, 10)
            .When(x => x.Rating.HasValue)
            .WithMessage("Rating must be between 0 and 10");
    }

    private bool BeValidGenre(string genre)
    {
        return Enum.TryParse<Genre>(genre, true, out _);
    }

    private bool BeAValidDate(DateTime date)
    {
        return date >= new DateTime(1900, 1, 1) &&
               date <= DateTime.Today.AddYears(10);
    }

}