import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <h2>Search Movies</h2>
    <div class="search-form">
      <div class="radio-group">
        <label><input type="radio" name="type" value="title" [(ngModel)]="searchType"> Title</label>
        <label><input type="radio" name="type" value="genre" [(ngModel)]="searchType"> Genre</label>
        <label><input type="radio" name="type" value="year" [(ngModel)]="searchType"> Year</label>
        <label><input type="radio" name="type" value="director" [(ngModel)]="searchType"> Director</label>
      </div>
      <input type="text" [(ngModel)]="searchValue" placeholder="Enter search term">
      <button (click)="search()">Search</button>
    </div>
    <div *ngIf="searched">
      <h3>Results ({{results.length}})</h3>
      <div *ngIf="results.length === 0">No movies found.</div>
      <div class="results">
        <div *ngFor="let movie of results" class="result-item">
          <h4>{{movie.title}}</h4>
          <p>{{movie.directors}} | {{movie.genre}} | {{movie.releaseDate}}</p>
          <button [routerLink]="['/movie', movie.id]">View</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    h2, h3 { color: #333; }
    .search-form { background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
    .radio-group { display: flex; gap: 15px; margin-bottom: 15px; }
    .radio-group label { cursor: pointer; }
    input[type="text"] { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 10px; }
    button { padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; }
    button:hover { background: #218838; }
    .results { display: flex; flex-direction: column; gap: 15px; }
    .result-item { border: 1px solid #ddd; padding: 15px; border-radius: 8px; background: white; }
    .result-item h4 { margin: 0 0 10px 0; }
  `]
})
export class SearchComponent {
  searchType = 'title';
  searchValue = '';
  results: Movie[] = [];
  searched = false;

  constructor(private movieService: MovieService) {}

  search() {
    if (!this.searchValue.trim()) return;
    this.movieService.searchMovies(this.searchType, this.searchValue).subscribe({
      next: (data) => { this.results = data; this.searched = true; },
      error: (err) => console.error('Search failed', err)
    });
  }
}