import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie.model';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-movie-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>{{isEdit ? 'Edit Movie' : 'Add New Movie'}}</h2>
      
      <!-- Loading State -->
      <div *ngIf="isEdit && isLoading" class="loading-container">
        <div class="spinner"></div>
        <p>Loading movie details...</p>
      </div>
      
      <!-- Form - Only show when not loading -->
      <form *ngIf="!isLoading" #movieForm="ngForm" (ngSubmit)="onSubmit(movieForm)" class="form">
        
        <!-- Title -->
        <div class="form-group">
          <label for="title">Title <span class="required">*</span></label>
          <input 
            type="text" 
            id="title" 
            name="title"
            [(ngModel)]="movie.title"
            required
            #title="ngModel"
            class="form-control"
            [class.invalid]="title.invalid && title.touched">
          <div *ngIf="title.invalid && title.touched" class="error-message">
            ⚠ Title is required
          </div>
        </div>
        
        <!-- Directors -->
        <div class="form-group">
          <label for="directors">Directors <span class="required">*</span></label>
          <input 
            type="text" 
            id="directors" 
            name="directors"
            [(ngModel)]="movie.directors"
            required
            #directors="ngModel"
            placeholder="e.g., Christopher Nolan"
            class="form-control"
            [class.invalid]="directors.invalid && directors.touched">
          <div *ngIf="directors.invalid && directors.touched" class="error-message">
            ⚠ Directors must not be empty
          </div>
        </div>
        
        <!-- Actors -->
        <div class="form-group">
          <label for="actors">Actors <span class="required">*</span></label>
          <input 
            type="text" 
            id="actors" 
            name="actors"
            [(ngModel)]="movie.actors"
            required
            #actors="ngModel"
            placeholder="e.g., Leonardo DiCaprio, Tom Hardy"
            class="form-control"
            [class.invalid]="actors.invalid && actors.touched">
          <div *ngIf="actors.invalid && actors.touched" class="error-message">
            ⚠ Actors must not be empty
          </div>
        </div>
        
        <!-- Release Date -->
        <div class="form-group">
          <label for="releaseDate">Release Date <span class="required">*</span> (yyyy-MM-dd)</label>
          <input 
            type="date" 
            id="releaseDate" 
            name="releaseDate"
            [(ngModel)]="movie.releaseDate"
            required
            #releaseDate="ngModel"
            class="form-control"
            [class.invalid]="releaseDate.invalid && releaseDate.touched">
          <div *ngIf="releaseDate.invalid && releaseDate.touched" class="error-message">
            ⚠ Release Date is required
          </div>
        </div>
        
        <!-- Runtime -->
        <div class="form-group">
          <label for="runtime">Runtime <span class="required">*</span> (HH:mm:ss)</label>
          <input 
            type="text" 
            id="runtime" 
            name="runtime"
            [(ngModel)]="movie.runtime"
            required
            pattern="^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$"
            placeholder="01:30:00"
            #runtime="ngModel"
            class="form-control"
            [class.invalid]="runtime.invalid && runtime.touched">
          <div *ngIf="runtime.invalid && runtime.touched" class="error-message">
            ⚠ Runtime must be in HH:mm:ss format (e.g., 01:30:00)
          </div>
        </div>
        
        <!-- Genre -->
        <div class="form-group">
          <label for="genre">Genre <span class="required">*</span></label>
          <select 
            id="genre" 
            name="genre"
            [(ngModel)]="movie.genre"
            required
            #genre="ngModel"
            class="form-control"
            [class.invalid]="genre.invalid && genre.touched">
             <option value="">-- Select Genre --</option>
             <option value="Action">Action</option>
             <option value="Comedy">Comedy</option>
             <option value="Drama">Drama</option>
             <option value="Horror">Horror</option>
             <option value="Romance">Romance</option>
             <option value="SciFi">Sci-Fi</option>
             <option value="Thriller">Thriller</option>
             <option value="Documentary">Documentary</option>

          </select>
          <div *ngIf="genre.invalid && genre.touched" class="error-message">
            ⚠ Genre selection is required
          </div>
        </div>
        
        <!-- Rating (Optional) -->
        <div class="form-group">
          <label for="rating">Rating (0-10)</label>
          <input 
            type="number" 
            id="rating" 
            name="rating"
            [(ngModel)]="movie.rating"
            min="0" 
            max="10" 
            step="0.1"
            class="form-control">
          <small class="hint">Optional - Leave empty if not applicable</small>
        </div>
        
        <!-- Plot (Optional) -->
        <div class="form-group">
          <label for="plot">Plot</label>
          <textarea 
            id="plot" 
            name="plot"
            [(ngModel)]="movie.plot"
            rows="4"
            class="form-control"
            placeholder="Enter movie plot summary..."></textarea>
          <small class="hint">Optional</small>
        </div>
        
        <!-- Image URL (Optional) -->
        <div class="form-group">
          <label for="imageUrl">Image URL</label>
          <input 
            type="text" 
            id="imageUrl" 
            name="imageUrl"
            [(ngModel)]="movie.imageUrl"
            placeholder="https://example.com/poster.jpg"
            class="form-control">
          <small class="hint">Optional</small>
        </div>
        
        <!-- Form Actions -->
        <div class="form-actions">
          <button 
            type="submit" 
            class="btn-submit" 
            [disabled]="movieForm.invalid || isSubmitting">
            {{isSubmitting ? 'Saving...' : (isEdit ? 'Update Movie' : 'Add Movie')}}
          </button>
          <button 
            type="button" 
            class="btn-cancel" 
            (click)="cancel()"
            [disabled]="isSubmitting">
            Cancel
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .container {
      max-width: 700px;
      margin: 0 auto;
      padding: 25px;
    }

    h2 {
      color: #333;
      margin-bottom: 25px;
      font-size: 26px;
      border-bottom: 2px solid #007bff;
      padding-bottom: 10px;
    }

    .loading-container {
      background: white;
      padding: 60px 30px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      text-align: center;
    }

    .spinner {
      border: 4px solid #f3f3f3;
      border-top: 4px solid #007bff;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .loading-container p {
      color: #666;
      font-size: 16px;
      margin: 0;
    }

    .form {
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .form-group {
      margin-bottom: 20px;
    }

    label {
      display: block;
      margin-bottom: 6px;
      color: #333;
      font-weight: 600;
      font-size: 14px;
    }

    .required {
      color: #dc3545;
    }

    .form-control {
      width: 100%;
      padding: 10px;
      border: 2px solid #ddd;
      border-radius: 6px;
      font-size: 15px;
      transition: border-color 0.3s;
    }

    .form-control:focus {
      outline: none;
      border-color: #007bff;
    }

    .form-control.invalid {
      border-color: #dc3545;
      background-color: #fff5f5;
    }

    .error-message {
      color: #dc3545;
      font-size: 13px;
      margin-top: 5px;
    }

    .hint {
      color: #6c757d;
      font-size: 12px;
      font-style: italic;
      margin-top: 3px;
      display: block;
    }

    textarea.form-control {
      resize: vertical;
      min-height: 100px;
      font-family: inherit;
    }

    .form-actions {
      display: flex;
      gap: 12px;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eee;
    }

    .btn-submit, .btn-cancel {
      flex: 1;
      padding: 12px 24px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 16px;
      font-weight: 600;
      transition: all 0.3s;
    }

    .btn-submit {
      background: #28a745;
      color: white;
    }

    .btn-submit:hover:not(:disabled) {
      background: #218838;
    }

    .btn-submit:disabled {
      background: #95a5a6;
      cursor: not-allowed;
    }

    .btn-cancel {
      background: #6c757d;
      color: white;
    }

    .btn-cancel:hover:not(:disabled) {
      background: #5a6268;
    }
  `]
})
export class MovieFormComponent implements OnInit {
  movie: Movie = {
    title: '',
    actors: '',
    directors: '',
    releaseDate: '',
    runtime: '',
    genre: '',
    plot: '',
    rating: undefined,
    imageUrl: ''
  };
  
  isEdit = false;
  isLoading = false;
  isSubmitting = false;
  movieId: number | null = null;

  constructor(
    private movieService: MovieService,
    private route: ActivatedRoute,
    private router: Router,
    private notification: NotificationService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.movieId = +id;
      this.loadMovie(this.movieId);
    }
  }

  loadMovie(id: number) {
  this.isLoading = true;
  
  this.movieService.getMovieById(id).subscribe({
    next: (data) => {
        let formattedDate = '';
      if (data.releaseDate) {
        const date = new Date(data.releaseDate);
        if (!isNaN(date.getTime())) {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          formattedDate = `${year}-${month}-${day}`;
        }
      }
      // Wrap in setTimeout to avoid change detection error
      setTimeout(() => {
        this.movie = {
          title: data.title || '',
          actors: data.actors || '',
          directors: data.directors || '',
          releaseDate:formattedDate || '',
          runtime: data.runtime || '',
          genre: data.genre || '',
          plot: data.plot || '',
          rating: data.rating,
          imageUrl: data.imageUrl || ''
        };
        this.isLoading = false;
      });
    },
    error: (err) => {
      console.error('Error loading movie:', err);
      this.notification.showError('Failed to load movie details');
      this.isLoading = false;
      this.router.navigate(['/']);
    }
  });
}

  onSubmit(form: any) {
    // Mark all fields as touched
    Object.keys(form.controls).forEach(key => {
      form.controls[key].markAsTouched();
    });

    // Check form validity
    if (form.invalid) {
      this.notification.showWarning('Please fill in all required fields correctly');
      return;
    }

    // Prepare movie data
    const movieData: Movie = {
      title: this.movie.title?.trim() || '',
      actors: this.movie.actors?.trim() || '',
      directors: this.movie.directors?.trim() || '',
      releaseDate: this.movie.releaseDate || '',
      runtime: this.movie.runtime?.trim() || '',
      genre: this.movie.genre || '',
      plot: this.movie.plot?.trim() || '',
      rating: this.movie.rating || 0,
      imageUrl: this.movie.imageUrl?.trim() || ''
    };

    if (this.isEdit && this.movieId) {
      movieData.id = this.movieId;
    }

    this.isSubmitting = true;

    const operation = this.isEdit
      ? this.movieService.updateMovie(this.movieId!, movieData)
      : this.movieService.createMovie(movieData);

    operation.subscribe({
      next: () => {
        const message = this.isEdit 
          ? '✅ Movie updated successfully!' 
          : '✅ Movie added successfully!';
        this.notification.showSuccess(message);
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Error saving movie:', err);
        this.isSubmitting = false;

        // Parse backend validation errors
        if (err.status === 400 && err.error?.errors) {
          const errors = err.error.errors;
          const errorMessages: string[] = [];
          
          for (const key in errors) {
            if (errors.hasOwnProperty(key)) {
              const messages = errors[key];
              if (Array.isArray(messages)) {
                messages.forEach(msg => errorMessages.push(`${key}: ${msg}`));
              } else {
                errorMessages.push(`${key}: ${messages}`);
              }
            }
          }
          
          this.notification.showError(`Validation failed: ${errorMessages.join(', ')}`);
        } else {
          const errorMsg = err.error?.title || err.error?.message || 'Failed to save movie';
          this.notification.showError(errorMsg);
        }
      }
    });
  }

  cancel() {
    this.router.navigate(['/']);
  }
}