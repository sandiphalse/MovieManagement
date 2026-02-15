using MovieManagement.Domain.Entities.Class;
using MovieManagement.Domain.Entities.Enums;
using System;
using System.Collections.Generic;

namespace MovieManagement.Tests.Helpers
{
    public static class TestDataHelper
    {
        public static List<Movie> GetTestMovies()
        {
            return new List<Movie>
            {
                new Movie
                {
                    Id = 1,
                    Title = "The Shawshank Redemption",
                    Directors = "Frank Darabont",
                    Actors = "Tim Robbins, Morgan Freeman",  // ✅ String
                    ReleaseDate = new DateTime(1994, 9, 23),  // ✅ DateTime
                    Runtime = TimeSpan.Parse("02:22:00"),     // ✅ TimeSpan
                    Genre = Genre.Drama,                       // ✅ Enum
                    Plot = "Two imprisoned men bond over a number of years...",
                    Rating = 9.3m,
                    ImageUrl = "https://example.com/shawshank.jpg"
                },
                new Movie
                {
                    Id = 2,
                    Title = "The Godfather",
                    Directors = "Francis Ford Coppola",
                    Actors = "Marlon Brando, Al Pacino",
                    ReleaseDate = new DateTime(1972, 3, 24),
                    Runtime = TimeSpan.Parse("02:55:00"),
                    Genre = Genre.Drama,
                    Plot = "The aging patriarch of an organized crime dynasty...",
                    Rating = 9.2m,
                    ImageUrl = "https://example.com/godfather.jpg"
                },
                new Movie
                {
                    Id = 3,
                    Title = "The Dark Knight",
                    Directors = "Christopher Nolan",
                    Actors = "Christian Bale, Heath Ledger",
                    ReleaseDate = new DateTime(2008, 7, 18),
                    Runtime = TimeSpan.Parse("02:32:00"),
                    Genre = Genre.Action,
                    Plot = "When the menace known as the Joker wreaks havoc...",
                    Rating = 9.0m,
                    ImageUrl = "https://example.com/darkknight.jpg"
                }
            };
        }

        public static Movie GetSingleTestMovie()
        {
            return new Movie
            {
                Id = 1,
                Title = "Test Movie",
                Directors = "Test Director",
                Actors = "Test Actor",
                ReleaseDate = new DateTime(2024, 1, 1),  // ✅ DateTime
                Runtime = TimeSpan.Parse("01:30:00"),    // ✅ TimeSpan
                Genre = Genre.Action,                     // ✅ Enum
                Plot = "Test plot",
                Rating = 7.5m,
                ImageUrl = "https://example.com/test.jpg"
            };
        }
    }
}