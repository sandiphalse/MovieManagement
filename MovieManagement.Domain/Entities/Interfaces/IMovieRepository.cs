using MovieManagement.Domain.Entities.Class;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MovieManagement.Domain.Entities.Interfaces
{
    public interface IMovieRepository
    {
        Task<List<Movie>> GetAllAsync();
        Task<Movie?> GetByIdAsync(int id);
        Task<List<Movie>> GetLatestAsync(int count);
        Task<List<Movie>> SearchAsync(string searchType, string searchValue);
        Task<Movie> CreateAsync(Movie movie);
        Task<Movie> UpdateAsync(Movie movie);
        Task DeleteAsync(int id);
    }
}
