import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { HomeComponent } from './home.component';
import { MovieService } from '../../services/movie.service';
import { NotificationService } from '../../services/notification.service';
import { of, throwError } from 'rxjs';
import { Movie } from '../../models/movie.model';
import { vi } from 'vitest';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  let movieService: any;
  let notificationService: any;

  const mockMovies: Movie[] = [
    {
      id: 1,
      title: 'Test Movie 1',
      directors: 'Director 1',
      actors: 'Actor 1',
      releaseDate: '2024-01-01',
      runtime: '01:30:00',
      genre: 'Action',
      rating: 7.5
    },
    {
      id: 2,
      title: 'Test Movie 2',
      directors: 'Director 2',
      actors: 'Actor 2',
      releaseDate: '2024-02-01',
      runtime: '02:00:00',
      genre: 'Drama',
      rating: 8.0
    }
  ];

  beforeEach(async () => {
    movieService = {
      getLatestMovies: vi.fn(),
      searchMovies: vi.fn()
    };

    notificationService = {
      showSuccess: vi.fn(),
      showError: vi.fn(),
      showWarning: vi.fn(),
      showInfo: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        HttpClientTestingModule
      ],
      providers: [
        provideRouter([]), // ⭐ FIXES ActivatedRoute + RouterLink
        { provide: MovieService, useValue: movieService },
        { provide: NotificationService, useValue: notificationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('loadLatestMovies', () => {
    it('should load movies on init', () => {
      movieService.getLatestMovies.mockReturnValue(of(mockMovies));

      fixture.detectChanges(); // triggers ngOnInit

      expect(component.movies.length).toBe(2);
      expect(component.isLoading).toBe(false);
      expect(movieService.getLatestMovies).toHaveBeenCalled();
    });

    it('should handle error when loading movies fails', () => {
      movieService.getLatestMovies.mockReturnValue(
        throwError(() => new Error('API Error'))
      );

      fixture.detectChanges();

      expect(component.isLoading).toBe(false);
      expect(notificationService.showError)
        .toHaveBeenCalledWith('Failed to load movies');
    });
  });

  describe('search functionality', () => {
    it('should toggle search view', () => {
      expect(component.showSearch).toBe(false);

      component.toggleSearch();
      expect(component.showSearch).toBe(true);

      component.toggleSearch();
      expect(component.showSearch).toBe(false);
    });

    it('should perform search and display results', () => {
      movieService.searchMovies.mockReturnValue(of([mockMovies[0]]));

      component.searchType = 'title';
      component.searchValue = 'Test';
      component.performSearch();

      expect(movieService.searchMovies)
        .toHaveBeenCalledWith('title', 'Test');
      expect(component.searchResults.length).toBe(1);
      expect(component.isSearching).toBe(false);
      expect(component.searchPerformed).toBe(true);
    });

    it('should show warning when search value is empty', () => {
      component.searchValue = '';
      component.performSearch();

      expect(notificationService.showWarning)
        .toHaveBeenCalledWith('Please enter a search term');
      expect(movieService.searchMovies).not.toHaveBeenCalled();
    });

    it('should show info when no results found', () => {
      movieService.searchMovies.mockReturnValue(of([]));

      component.searchType = 'title';
      component.searchValue = 'NonExistent';
      component.performSearch();

      expect(component.searchResults.length).toBe(0);
      expect(notificationService.showInfo)
        .toHaveBeenCalledWith('No movies found matching your search');
    });

    it('should handle search error', () => {
      movieService.searchMovies.mockReturnValue(
        throwError(() => new Error('Search failed'))
      );

      component.searchType = 'title';
      component.searchValue = 'Test';
      component.performSearch();

      expect(notificationService.showError)
        .toHaveBeenCalledWith('Search failed. Please try again.');
      expect(component.searchResults.length).toBe(0);
      expect(component.isSearching).toBe(false);
    });
  });
});
