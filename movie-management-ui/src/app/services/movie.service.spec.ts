import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MovieService } from './movie.service';
import { Movie } from '../models/movie.model';

describe('MovieService', () => {
  let service: MovieService;
  let httpMock: HttpTestingController;

  const apiUrl = 'http://localhost:5000/api/movies';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MovieService]
    });

    service = TestBed.inject(MovieService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // =========================
  // GET LATEST MOVIES
  // =========================
  describe('getLatestMovies', () => {
    it('should return latest movies from API', () => {
      const mockMovies: Movie[] = [
        {
          id: 1,
          title: 'Test Movie',
          directors: 'Test Director',
          actors: 'Test Actor',
          releaseDate: '2024-01-01',
          runtime: '01:30:00',
          genre: 'Action',
          rating: 7.5
        }
      ];

      service.getLatestMovies().subscribe(movies => {
        expect(movies.length).toBe(1);
        expect(movies[0].title).toBe('Test Movie');
      });

      const req = httpMock.expectOne(`${apiUrl}/latest`);
      expect(req.request.method).toBe('GET');
      req.flush(mockMovies);
    });

    it('should handle API error', () => {
      service.getLatestMovies().subscribe({
        next: () => {
          throw new Error('Expected error but got success');
        },
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/latest`);
      req.flush('Error', { status: 500, statusText: 'Server Error' });
    });
  });

  // =========================
  // GET MOVIE BY ID
  // =========================
  describe('getMovieById', () => {
    it('should return movie by id', () => {
      const mockMovie: Movie = {
        id: 1,
        title: 'Test Movie',
        directors: 'Test Director',
        actors: 'Test Actor',
        releaseDate: '2024-01-01',
        runtime: '01:30:00',
        genre: 'Action',
        rating: 7.5
      };

      service.getMovieById(1).subscribe(movie => {
        expect(movie.id).toBe(1);
        expect(movie.title).toBe('Test Movie');
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockMovie);
    });

    it('should return 404 error', () => {
      service.getMovieById(999).subscribe({
        next: () => {
          throw new Error('Should not succeed');
        },
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/999`);
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });
  });

  // =========================
  // CREATE MOVIE
  // =========================
  describe('createMovie', () => {
    it('should create movie', () => {
      const newMovie: Movie = {
        title: 'New Movie',
        directors: 'Director',
        actors: 'Actor',
        releaseDate: '2024-01-01',
        runtime: '01:30:00',
        genre: 'Drama'
      };

      const created: Movie = { ...newMovie, id: 1 };

      service.createMovie(newMovie).subscribe(movie => {
        expect(movie.id).toBe(1);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      req.flush(created);
    });
  });

  // =========================
  // UPDATE MOVIE
  // =========================
  describe('updateMovie', () => {
    it('should update movie', () => {
      const updated: Movie = {
        id: 1,
        title: 'Updated Movie',
        directors: 'Dir',
        actors: 'Act',
        releaseDate: '2024-01-01',
        runtime: '02:00:00',
        genre: 'Action'
      };

      service.updateMovie(1, updated).subscribe(movie => {
        expect(movie.title).toBe('Updated Movie');
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('PUT');
      req.flush(updated);
    });
  });

  // =========================
  // DELETE MOVIE
  // =========================
  describe('deleteMovie', () => {
    it('should delete movie', () => {
      service.deleteMovie(1).subscribe(res => {
        expect(res).toBeNull();
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  // =========================
  // SEARCH
  // =========================
  describe('searchMovies', () => {
    it('should search by title', () => {
      const mock: Movie[] = [
        {
          id: 1,
          title: 'Dark Knight',
          directors: 'Nolan',
          actors: 'Bale',
          releaseDate: '2008-07-18',
          runtime: '02:32:00',
          genre: 'Action'
        }
      ];

      service.searchMovies('title', 'Dark').subscribe(res => {
        expect(res.length).toBe(1);
      });

      const req = httpMock.expectOne(`${apiUrl}/search?searchType=title&searchValue=Dark`);
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });
});
