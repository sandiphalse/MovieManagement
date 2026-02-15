import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie.model';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container">
      <!-- Header with Add and Search Buttons -->
      <div class="header">
        <div class="header-actions">

          <button *ngIf="!showSearch" (click)="toggleSearch()" class="btn-search">
            🔍 Search Movies
          </button>
          <button *ngIf="showSearch" (click)="toggleSearch()" class="btn-back">
            ← Back to Latest Movies
          </button>
        </div>
      </div>

      <!-- Latest Movies View -->
      <div *ngIf="!showSearch">
        <h3>Latest 4 Movies</h3>
        
        <div *ngIf="isLoading" class="loading">
          Loading movies...
        </div>

        <table *ngIf="!isLoading && movies.length > 0" class="movie-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Director</th>
              <th>Actors</th>
              <th>Genre</th>
              <th>Release Date</th>
              <th>Runtime</th>
              <th>Rating</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            <tr *ngFor="let movie of movies">
              <td>{{movie.title}}</td>
              <td>{{movie.directors}}</td>
              <td>{{movie.actors}}</td>
              <td>{{movie.genre}}</td>
             <td>{{ movie.releaseDate | date:'yyyy-MM-dd' }}</td>
              <td>{{movie.runtime}}</td>
              <td>{{movie.rating || '-'}}</td>
              <td>
                <button [routerLink]="['/movie', movie.id]" class="btn-view">
                  View
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div *ngIf="!isLoading && movies.length === 0" class="no-data">
          No movies found. <a routerLink="/add-movie">Add your first movie!</a>
        </div>
      </div>

      <!-- Search View -->
      <div *ngIf="showSearch">
        <h3>Search Movies</h3>
        
        <div class="search-form">
          <div class="search-criteria">
            <label class="radio-label">
              <input type="radio" name="searchType" value="title" [(ngModel)]="searchType">
              Title
            </label>
            <label class="radio-label">
              <input type="radio" name="searchType" value="genre" [(ngModel)]="searchType">
              Genre
            </label>
            <label class="radio-label">
              <input type="radio" name="searchType" value="year" [(ngModel)]="searchType">
              Year
            </label>
            <label class="radio-label">
              <input type="radio" name="searchType" value="director" [(ngModel)]="searchType">
              Director
            </label>
          </div>
          
          <div class="search-input-group">
            <input 
              type="text" 
              [(ngModel)]="searchValue" 
              placeholder="Enter search term..."
              class="search-input"
              (keyup.enter)="performSearch()">
            <button (click)="performSearch()" class="btn-search-submit">
              Search
            </button>
          </div>
        </div>

        <div *ngIf="isSearching" class="loading">
          Searching...
        </div>

        <div *ngIf="!isSearching && searchResults.length > 0">
          <h4>Search Results ({{searchResults.length}} found)</h4>
          
          <table class="movie-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Director</th>
                <th>Actors</th>
                <th>Genre</th>
                <th>Release Date</th>
                <th>Runtime</th>
                <th>Rating</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              <tr *ngFor="let movie of searchResults">
                <td>{{movie.title}}</td>
                <td>{{movie.directors}}</td>
                <td>{{movie.actors}}</td>
                <td>{{movie.genre}}</td>
                <td>{{movie.releaseDate}}</td>
                <td>{{movie.runtime}}</td>
                <td>{{movie.rating || '-'}}</td>
                <td>
                  <button [routerLink]="['/movie', movie.id]" class="btn-view">
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div *ngIf="!isSearching && searchPerformed && searchResults.length === 0" class="no-data">
          No movies found matching your search criteria.
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 25px;
      font-family: Arial, sans-serif;
    }

    .header {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-bottom: 25px;
      padding-bottom: 15px;
      border-bottom: 2px solid #007bff;
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }

    h3 {
      color: #333;
      margin-bottom: 20px;
      font-size: 22px;
    }

    h4 {
      color: #555;
      margin: 20px 0 15px 0;
      font-size: 18px;
    }

    .btn-add, .btn-search, .btn-back {
      padding: 10px 20px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 15px;
      font-weight: 600;
      transition: all 0.3s;
    }

    .btn-add {
      background: #28a745;
      color: white;
    }

    .btn-add:hover {
      background: #218838;
    }

    .btn-search {
      background: #007bff;
      color: white;
    }

    .btn-search:hover {
      background: #0056b3;
    }

    .btn-back {
      background: #6c757d;
      color: white;
    }

    .btn-back:hover {
      background: #5a6268;
    }

    .search-form {
      background: #f8f9fa;
      padding: 25px;
      border-radius: 8px;
      margin-bottom: 25px;
      border: 1px solid #ddd;
    }

    .search-criteria {
      display: flex;
      gap: 25px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }

    .radio-label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      font-size: 15px;
      color: #333;
    }

    .radio-label input[type="radio"] {
      cursor: pointer;
      width: 18px;
      height: 18px;
    }

    .search-input-group {
      display: flex;
      gap: 10px;
    }

    .search-input {
      flex: 1;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 15px;
    }

    .search-input:focus {
      outline: none;
      border-color: #007bff;
    }

    .btn-search-submit {
      padding: 12px 30px;
      background: #28a745;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 15px;
      font-weight: 600;
      transition: background 0.3s;
    }

    .btn-search-submit:hover {
      background: #218838;
    }

    .loading {
      font-size: 16px;
      color: #666;
      text-align: center;
      padding: 20px;
    }

    .movie-table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      border-radius: 8px;
      overflow: hidden;
    }

    .movie-table th {
      background-color: #007bff;
      color: white;
      padding: 14px 12px;
      text-align: left;
      font-size: 14px;
      font-weight: 600;
    }

    .movie-table td {
      padding: 12px;
      border-bottom: 1px solid #ddd;
      font-size: 14px;
      color: #555;
    }

    .movie-table tbody tr:hover {
      background-color: #f5f5f5;
    }

    .movie-table tbody tr:last-child td {
      border-bottom: none;
    }

    .btn-view {
      padding: 6px 16px;
      background: #28a745;
      border: none;
      color: white;
      border-radius: 4px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 600;
      transition: background 0.3s;
    }

    .btn-view:hover {
      background: #218838;
    }

    .no-data {
      margin-top: 20px;
      padding: 30px;
      text-align: center;
      font-size: 16px;
      color: #888;
      background: white;
      border-radius: 8px;
      border: 1px solid #ddd;
    }

    .no-data a {
      color: #007bff;
      text-decoration: none;
      font-weight: 600;
    }

    .no-data a:hover {
      text-decoration: underline;
    }
  `]
})
export class HomeComponent implements OnInit {
  movies: Movie[] = [];
  isLoading = true;
  showSearch = false;
  searchType = 'title';
  searchValue = '';
  searchResults: Movie[] = [];
  isSearching = false;
  searchPerformed = false;

  constructor(
    private movieService: MovieService,
    private cd: ChangeDetectorRef,
    private notification: NotificationService
  ) {}

  ngOnInit() {
    this.loadLatestMovies();
  }

  loadLatestMovies() {
    this.isLoading = true;
    
    const timeoutWarning = setTimeout(() => {
      if (this.isLoading) {
        this.notification.showWarning('Taking longer than expected... Please wait.');
      }
    }, 5000);
    
    this.movieService.getLatestMovies().subscribe({
      next: (data) => {
        clearTimeout(timeoutWarning);
        this.movies = [...data];
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        clearTimeout(timeoutWarning);
        console.error('Error loading movies:', err);
        this.isLoading = false;
        this.notification.showError('Failed to load movies');
        this.cd.detectChanges();
      }
    });
  }

  toggleSearch() {
    this.showSearch = !this.showSearch;
    if (!this.showSearch) {
      this.searchValue = '';
      this.searchResults = [];
      this.searchPerformed = false;
    }
  }

  performSearch() {
    if (!this.searchValue.trim()) {
      this.notification.showWarning('Please enter a search term');
      return;
    }

    this.isSearching = true;
    this.searchPerformed = true;
    
    this.movieService.searchMovies(this.searchType, this.searchValue).subscribe({
      next: (data) => {
        this.searchResults = [...data];
        this.isSearching = false;
        
        if (data.length === 0) {
          this.notification.showInfo('No movies found matching your search');
        }
        
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Search error:', err);
        this.notification.showError('Search failed. Please try again.');
        this.searchResults = [];
        this.isSearching = false;
        this.cd.detectChanges();
      }
    });
  }
}