using Microsoft.EntityFrameworkCore;
using MovieManagement.Domain.Entities;
using MovieManagement.Domain.Entities.Class;
using MovieManagement.Domain.Entities.Enums;
using MovieManagement.Domain.Entities.Interfaces;

using MovieManagement.Infrastructure.Data;

namespace MovieManagement.Infrastructure.Repositories;

public class MovieRepository : IMovieRepository
{
    private readonly ApplicationDbContext _context;

    public MovieRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Movie>> GetAllAsync()
    {
        return await _context.Movies.ToListAsync();
    }

    public async Task<Movie?> GetByIdAsync(int id)
    {
        return await _context.Movies.FindAsync(id);
    }

    public async Task<List<Movie>> GetLatestAsync(int count)
    {
        return await _context.Movies
            .AsNoTracking() 
            .OrderByDescending(m => m.ReleaseDate)
            .Take(count)
            .ToListAsync();
    }

    public async Task<List<Movie>> SearchAsync(string searchType, string searchValue)
    {
        var query = _context.Movies.AsNoTracking();

        switch (searchType.ToLower())
        {
            case "title":
                query = query.Where(m => EF.Functions.Like(m.Title, $"%{searchValue}%"));
                break;
            case "director":
                query = query.Where(m => EF.Functions.Like(m.Directors, $"%{searchValue}%"));
                break;
            case "genre":
                query = query.Where(m => EF.Functions.Like(m.Genre.ToString(), $"%{searchValue}%"));
                break;
            case "year":
                query = query.Where(m => m.ReleaseDate.ToString().StartsWith(searchValue));
                break;
        }

        return await query.OrderByDescending(m => m.ReleaseDate).ToListAsync();
    }

    public async Task<Movie> CreateAsync(Movie movie)
    {
        _context.Movies.Add(movie);
        await _context.SaveChangesAsync();
        return movie;
    }

    public async Task<Movie> UpdateAsync(Movie movie)
    {
        _context.Movies.Update(movie);
        await _context.SaveChangesAsync();
        return movie;
    }

    public async Task DeleteAsync(int id)
    {
        var movie = await GetByIdAsync(id);
        if (movie != null)
        {
            _context.Movies.Remove(movie);
            await _context.SaveChangesAsync();
        }
    }
}