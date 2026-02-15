using NUnit.Framework;
using Moq;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using MovieManagement.API.Controllers;
using MovieManagement.API.DTO;
using MovieManagement.Domain.Entities.Class;
using MovieManagement.Domain.Entities.Enums;
using MovieManagement.Domain.Entities.Interfaces;
using MovieManagement.Tests.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MovieManagement.Tests.Controllers
{
    [TestFixture]
    public class MoviesControllerTests
    {
        private Mock<IMovieRepository> _mockRepository;
        private MoviesController _controller;

        [SetUp]
        public void Setup()
        {
            _mockRepository = new Mock<IMovieRepository>();
            _controller = new MoviesController(_mockRepository.Object);
        }

        #region GetLatest Tests

        [Test]
        public async Task GetLatest_ReturnsOkResult_WithListOfMovies()
        {
            // Arrange
            var movies = TestDataHelper.GetTestMovies();
            _mockRepository.Setup(repo => repo.GetLatestAsync(4))
                .ReturnsAsync(movies);

            // Act
            var result = await _controller.GetLatest();

            // Assert
            result.Result.Should().BeOfType<OkObjectResult>();
            var okResult = result.Result as OkObjectResult;
            var returnedMovies = okResult.Value as List<MovieManagement.API.DTO.Movie>;
            returnedMovies.Should().HaveCount(3);
        }

        #endregion

        #region GetById Tests

        [Test]
        public async Task GetById_ReturnsOkResult_WithMovie_WhenMovieExists()
        {
            // Arrange
            var movie = TestDataHelper.GetSingleTestMovie();
            _mockRepository.Setup(repo => repo.GetByIdAsync(1))
                .ReturnsAsync(movie);

            // Act
            var result = await _controller.GetById(1);

            // Assert
            result.Result.Should().BeOfType<OkObjectResult>();
            var okResult = result.Result as OkObjectResult;
            var returnedMovie = okResult.Value as MovieManagement.API.DTO.Movie;
            returnedMovie.Should().NotBeNull();
            returnedMovie.Title.Should().Be(movie.Title);
        }

        [Test]
        public async Task GetById_ReturnsNotFound_WhenMovieDoesNotExist()
        {
            // Arrange
            _mockRepository.Setup(repo => repo.GetByIdAsync(999))
                .ReturnsAsync((MovieManagement.Domain.Entities.Class.Movie)null);

            // Act
            var result = await _controller.GetById(999);

            // Assert
            result.Result.Should().BeOfType<NotFoundObjectResult>();
        }

        #endregion

        #region Create Tests

        [Test]
        public async Task Create_ReturnsCreatedAtAction_WithMovie()
        {
            // Arrange
            var createDto = new CreateMovie
            {
                Title = "Test Movie",
                Directors = "Test Director",
                Actors = "Test Actor",
                ReleaseDate = new DateTime(2024, 1, 1),
                Runtime = "01:30:00",
                Genre = "Action",
                Plot = "Test plot",
                Rating = 7.5m,
                ImageUrl = ""
            };

            var createdMovie = new MovieManagement.Domain.Entities.Class.Movie
            {
                Id = 1,
                Title = createDto.Title,
                Directors = createDto.Directors,
                Actors = createDto.Actors,
                ReleaseDate = createDto.ReleaseDate,
                Runtime = TimeSpan.Parse(createDto.Runtime),
                Genre = Genre.Action,
                Plot = createDto.Plot,
                Rating = createDto.Rating ?? 0,
                ImageUrl = createDto.ImageUrl
            };

            _mockRepository.Setup(repo => repo.CreateAsync(It.IsAny<MovieManagement.Domain.Entities.Class.Movie>()))
                .ReturnsAsync(createdMovie);

            // Act
            var result = await _controller.Create(createDto);

            // Assert
            result.Result.Should().BeOfType<CreatedAtActionResult>();
            var createdResult = result.Result as CreatedAtActionResult;
            createdResult.ActionName.Should().Be(nameof(MoviesController.GetById));
        }

        #endregion

        #region Update Tests

        [Test]
        public async Task Update_ReturnsOkResult_WhenMovieExists()
        {
            // Arrange
            var existingMovie = TestDataHelper.GetSingleTestMovie();
            var updateDto = new UpdateMovie
            {
                Title = "Updated Title",
                Directors = "Updated Director",
                Actors = "Updated Actor",
                ReleaseDate = new DateTime(2024, 6, 1),
                Runtime = "02:00:00",
                Genre = "Drama",
                Plot = "Updated plot",
                Rating = 9.0m
            };

            _mockRepository.Setup(repo => repo.GetByIdAsync(1))
                .ReturnsAsync(existingMovie);
            _mockRepository.Setup(repo => repo.UpdateAsync(It.IsAny<MovieManagement.Domain.Entities.Class.Movie>()))
                .ReturnsAsync(existingMovie);

            // Act
            var result = await _controller.Update(1, updateDto);

            // Assert
            result.Result.Should().BeOfType<OkObjectResult>();
        }

        [Test]
        public async Task Update_ReturnsNotFound_WhenMovieDoesNotExist()
        {
            // Arrange
            var updateDto = new UpdateMovie
            {
                Title = "Updated Title",
                Genre = "Drama"
            };

            _mockRepository.Setup(repo => repo.GetByIdAsync(999))
                .ReturnsAsync((MovieManagement.Domain.Entities.Class.Movie)null);

            // Act
            var result = await _controller.Update(999, updateDto);

            // Assert
            result.Result.Should().BeOfType<NotFoundObjectResult>();
        }

        #endregion

        #region Delete Tests

        [Test]
        public async Task Delete_ReturnsNoContent_WhenMovieExists()
        {
            // Arrange
            var movie = TestDataHelper.GetSingleTestMovie();
            _mockRepository.Setup(repo => repo.GetByIdAsync(1))
                .ReturnsAsync(movie);
            _mockRepository.Setup(repo => repo.DeleteAsync(1))
                .Returns(Task.CompletedTask);

            // Act
            var result = await _controller.Delete(1);

            // Assert
            result.Should().BeOfType<NoContentResult>();
        }

        [Test]
        public async Task Delete_ReturnsNotFound_WhenMovieDoesNotExist()
        {
            // Arrange
            _mockRepository.Setup(repo => repo.GetByIdAsync(999))
                .ReturnsAsync((MovieManagement.Domain.Entities.Class.Movie)null);

            // Act
            var result = await _controller.Delete(999);

            // Assert
            result.Should().BeOfType<NotFoundObjectResult>();
        }

        #endregion

        #region Search Tests

        [Test]
        public async Task Search_ReturnsOkResult_WithMatchingMovies()
        {
            // Arrange
            var movies = TestDataHelper.GetTestMovies().Take(1).ToList();
            _mockRepository.Setup(repo => repo.SearchAsync("title", "Dark"))
                .ReturnsAsync(movies);

            // Act
            var result = await _controller.Search("title", "Dark");

            // Assert
            result.Result.Should().BeOfType<OkObjectResult>();
        }

        #endregion
    }
}