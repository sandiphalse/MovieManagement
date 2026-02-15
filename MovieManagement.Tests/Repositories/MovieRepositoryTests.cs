using NUnit.Framework;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using MovieManagement.Infrastructure.Data;
using MovieManagement.Infrastructure.Repositories;
using MovieManagement.Domain.Entities.Class;
using MovieManagement.Domain.Entities.Enums;
using MovieManagement.Tests.Helpers;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace MovieManagement.Tests.Repositories
{
    [TestFixture]
    public class MovieRepositoryTests
    {
        private ApplicationDbContext _context;
        private MovieRepository _repository;

        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "TestMovieDb_" + Guid.NewGuid())
                .Options;

            _context = new ApplicationDbContext(options);
            _repository = new MovieRepository(_context);
        }

        [TearDown]
        public void TearDown()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }

        #region GetAllAsync Tests

        [Test]
        public async Task GetAllAsync_ReturnsAllMovies()
        {
            // Arrange
            var movies = TestDataHelper.GetTestMovies();
            await _context.Movies.AddRangeAsync(movies);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetAllAsync();

            // Assert
            result.Should().NotBeNull();
            result.Should().HaveCount(3);
        }

        [Test]
        public async Task GetAllAsync_ReturnsEmptyList_WhenNoMovies()
        {
            // Act
            var result = await _repository.GetAllAsync();

            // Assert
            result.Should().NotBeNull();
            result.Should().BeEmpty();
        }

        #endregion

        #region GetByIdAsync Tests

        [Test]
        public async Task GetByIdAsync_ReturnsMovie_WhenMovieExists()
        {
            // Arrange
            var movie = TestDataHelper.GetSingleTestMovie();
            await _context.Movies.AddAsync(movie);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetByIdAsync(movie.Id);

            // Assert
            result.Should().NotBeNull();
            result.Title.Should().Be(movie.Title);
        }

        [Test]
        public async Task GetByIdAsync_ReturnsNull_WhenMovieDoesNotExist()
        {
            // Act
            var result = await _repository.GetByIdAsync(999);

            // Assert
            result.Should().BeNull();
        }

        #endregion

        #region CreateAsync Tests

        [Test]
        public async Task CreateAsync_AddsMovieToDatabase()
        {
            // Arrange
            var movie = TestDataHelper.GetSingleTestMovie();

            // Act
            var created = await _repository.CreateAsync(movie);

            // Assert
            var savedMovie = await _context.Movies.FirstOrDefaultAsync(m => m.Title == movie.Title);
            savedMovie.Should().NotBeNull();
            savedMovie.Title.Should().Be(movie.Title);
        }

        [Test]
        public async Task CreateAsync_AssignsId_ToNewMovie()
        {
            // Arrange
            var movie = new Movie
            {
                Title = "New Movie",
                Directors = "New Director",
                Actors = "New Actor",
                ReleaseDate = new DateTime(2024, 1, 1),
                Runtime = TimeSpan.Parse("01:30:00"),
                Genre = Genre.Action,
                Plot = "New plot",
                Rating = 8.0m,
                ImageUrl = ""
            };

            // Act
            var created = await _repository.CreateAsync(movie);

            // Assert
            created.Id.Should().BeGreaterThan(0);
        }

        #endregion

        #region UpdateAsync Tests

        [Test]
        public async Task UpdateAsync_UpdatesExistingMovie()
        {
            // Arrange
            var movie = TestDataHelper.GetSingleTestMovie();
            await _context.Movies.AddAsync(movie);
            await _context.SaveChangesAsync();

            movie.Title = "Updated Title";
            movie.Rating = 9.5m;

            // Act
            var updated = await _repository.UpdateAsync(movie);

            // Assert
            updated.Should().NotBeNull();
            updated.Title.Should().Be("Updated Title");
            updated.Rating.Should().Be(9.5m);
        }

        #endregion

        #region DeleteAsync Tests

        [Test]
        public async Task DeleteAsync_RemovesMovie_WhenMovieExists()
        {
            // Arrange
            var movie = TestDataHelper.GetSingleTestMovie();
            await _context.Movies.AddAsync(movie);
            await _context.SaveChangesAsync();

            // Act
            await _repository.DeleteAsync(movie.Id);

            // Assert
            var deletedMovie = await _context.Movies.FindAsync(movie.Id);
            deletedMovie.Should().BeNull();
        }

        #endregion

        #region SearchAsync Tests

        [Test]
        public async Task SearchAsync_ByTitle_ReturnsMatchingMovies()
        {
            // Arrange
            var movies = TestDataHelper.GetTestMovies();
            await _context.Movies.AddRangeAsync(movies);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.SearchAsync("title", "Dark");

            // Assert
            result.Should().HaveCount(1);
            result.First().Title.Should().Contain("Dark");
        }

        [Test]
        public async Task SearchAsync_ByGenre_ReturnsMatchingMovies()
        {
            // Arrange
            var movies = TestDataHelper.GetTestMovies();
            await _context.Movies.AddRangeAsync(movies);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.SearchAsync("genre", "Drama");

            // Assert
            result.Should().HaveCount(2);
            result.Should().OnlyContain(m => m.Genre == Genre.Drama);
        }

        [Test]
        public async Task SearchAsync_ReturnsEmptyList_WhenNoMatches()
        {
            // Arrange
            var movies = TestDataHelper.GetTestMovies();
            await _context.Movies.AddRangeAsync(movies);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.SearchAsync("title", "NonExistent");

            // Assert
            result.Should().BeEmpty();
        }

        #endregion

        #region GetLatestAsync Tests

        [Test]
        public async Task GetLatestAsync_ReturnsLatestMovies()
        {
            // Arrange
            var movies = TestDataHelper.GetTestMovies();
            await _context.Movies.AddRangeAsync(movies);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetLatestAsync(2);

            // Assert
            result.Should().HaveCount(2);
            // Should return most recent movies (2008, 1994 before 1972)
            result.First().ReleaseDate.Should().Be(new DateTime(2008, 7, 18));
        }

        #endregion
    }
}