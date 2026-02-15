using MovieManagement.Domain.Entities;
using MovieManagement.Domain.Entities.Class;
using System.Text.Json;

namespace MovieManagement.Infrastructure.Data;

public static class DataSeeder
{
    public static void SeedMovies(ApplicationDbContext context, string jsonFilePath)
    {
        // Check if database is already seeded
        if (context.Movies.Any())
        {
            return;
        }

        // Read JSON file
        if (!File.Exists(jsonFilePath))
        {
            Console.WriteLine($"Warning: moviedata.json not found at {jsonFilePath}");
            return;
        }

        var jsonData = File.ReadAllText(jsonFilePath);
        var movies = JsonSerializer.Deserialize<List<Movie>>(jsonData);


        foreach (var movie in movies)
        {
            movie.Runtime = TimeSpan.FromSeconds(movie.RuntimeSeconds);
        }
        if (movies != null && movies.Any())
        {
            context.Movies.AddRange(movies);
            context.SaveChanges();
            Console.WriteLine($"Successfully seeded {movies.Count} movies");
        }
    }
}