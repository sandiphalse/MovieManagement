using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using MovieManagement.API.DTO;
using MovieManagement.Domain.Entities;
using MovieManagement.Domain.Entities.Enums;
using MovieManagement.Domain.Entities.Interfaces;
using System.Globalization;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace MovieManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[EnableCors("AllowAngular")]
public class MoviesController : ControllerBase
{
    private readonly IMovieRepository _repository;

    public MoviesController(IMovieRepository repository)
    {
        _repository = repository;
    }

    // GET: api/movies/latest
    [HttpGet("latest")]
    public async Task<ActionResult<List<Movie>>> GetLatest()
    {
        var movies = await _repository.GetLatestAsync(4);
        var movieDtos = movies.Select(MapToDto).ToList();
        return Ok(movieDtos);
    }

    // GET: api/movies/search
    [HttpGet("search")]
    public async Task<ActionResult<IEnumerable<Movie>>> Search(
    [FromQuery] string searchType,
    [FromQuery] string searchValue)
    {
        var results = await _repository.SearchAsync(searchType, searchValue);

        // Map to ensure consistent property names
        var response = results.Select(m => new
        {
            id = m.Id,
            title = m.Title,
            directors = m.Directors,
            actors = m.Actors,
            releaseDate = m.ReleaseDate.ToString(),  
            runtime = m.Runtime,
            genre = m.Genre,
            plot = m.Plot,
            rating = m.Rating,
            imageUrl = m.ImageUrl
        });
        return Ok(response);
    }

    // GET: api/movies/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<Movie>> GetById(int id)
    {
        var movie = await _repository.GetByIdAsync(id);
        if (movie == null)
        {
            return NotFound(new { message = $"Movie with ID {id} not found" });
        }

        var obj = MapToDto(movie);
        return Ok(obj);
    }

    // POST: api/movies
    [HttpPost]
    public async Task<ActionResult<Movie>> Create([FromBody] CreateMovie dto)
    {
        var movie = MapToEntity(dto);
        var created = await _repository.CreateAsync(movie);
        var movieDto = MapToDto(created);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, movieDto);
    }

    // PUT: api/movies/{id}
    [HttpPut("{id}")]
    public async Task<ActionResult<Movie>> Update(int id, [FromBody] UpdateMovie dto)
    {
        var movie = await _repository.GetByIdAsync(id);
        if (movie == null)
        {
            return NotFound(new { message = $"Movie with ID {id} not found" });
        }

        if (!string.IsNullOrWhiteSpace(dto.Title))
            movie.Title = dto.Title;
        if (!string.IsNullOrWhiteSpace(dto.Directors))
            movie.Directors = dto.Directors;
        if (dto.Actors != null && dto.Actors.Any())
            movie.Actors = dto.Actors;
        if (dto.ReleaseDate != null )
            movie.ReleaseDate = dto.ReleaseDate;
        if (!string.IsNullOrWhiteSpace(dto.Genre) &&
            Enum.TryParse<Genre>(dto.Genre, true, out var genre))
            movie.Genre = genre;
        if (!string.IsNullOrWhiteSpace(dto.Runtime) &&
            TimeSpan.TryParse(dto.Runtime, out var runtime))
            movie.Runtime = runtime;
        if (dto.Plot != null)
            movie.Plot = dto.Plot;
        if (dto.Rating.HasValue)
            movie.Rating = dto.Rating;

        var updated = await _repository.UpdateAsync(movie);
        return Ok(MapToDto(updated));
    }

    // DELETE: api/movies/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var movie = await _repository.GetByIdAsync(id);
        if (movie == null)
        {
            return NotFound(new { message = $"Movie with ID {id} not found" });
        }

        await _repository.DeleteAsync(id);
        return NoContent();
    }

    // Helper methods
    private static Movie MapToDto(MovieManagement.Domain.Entities.Class.Movie movie)
    {
        return new Movie
        {
            Id = movie.Id,
            Title = movie.Title,
            Directors = movie.Directors,
            Actors = movie.Actors,
            ReleaseDate = movie.ReleaseDate,
            Genre = movie.Genre.ToString(),
            Runtime = movie.Runtime.ToString(@"hh\:mm\:ss"),
            Plot = movie.Plot,
            Rating = movie.Rating
        };
    }

    private static MovieManagement.Domain.Entities.Class.Movie MapToEntity(CreateMovie dto)
    {
        return new MovieManagement.Domain.Entities.Class.Movie
        {
            Title = dto.Title,
            Directors = dto.Directors,
            Actors = dto.Actors ,
            ReleaseDate =  dto.ReleaseDate,
            Genre = Enum.Parse<Genre>(dto.Genre, true),

            Plot = dto.Plot ?? string.Empty,          
            Rating = dto.Rating ?? 0,                 
            ImageUrl = dto.ImageUrl ?? string.Empty
        };
    }

   
}