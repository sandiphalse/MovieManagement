namespace MovieManagement.API.DTO;

public class Movie
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Directors { get; set; } = string.Empty;
    public string Actors { get; set; } = string.Empty;
    public DateTime ReleaseDate { get; set; } 
    public string Genre { get; set; } = string.Empty;
    public string Runtime { get; set; } = string.Empty;
    public string? Plot { get; set; }
    public decimal? Rating { get; set; }

    public string? ImageUrl { get; set; } = string.Empty; 
}