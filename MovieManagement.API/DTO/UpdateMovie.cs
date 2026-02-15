using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace MovieManagement.API.DTO
{
    public class UpdateMovie
    {
        public string? Title { get; set; }
        public string? Directors { get; set; }
        public string Actors { get; set; }
        public DateTime ReleaseDate { get; set; }
        public string? Genre { get; set; }
        public string? Runtime { get; set; }
        public string? Plot { get; set; }
        public decimal? Rating { get; set; }

        public string? ImageUrl { get; set; } = string.Empty;


    }
}
