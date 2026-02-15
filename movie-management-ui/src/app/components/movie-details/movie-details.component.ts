import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie.model';
import { NotificationService } from '../../services/notification.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule, RouterModule, MatDialogModule],
  template: `
    <div class="container">
      <div *ngIf="loading" class="loading">
        <div class="spinner"></div>
        <p>Loading movie details...</p>
      </div>
      
      <div *ngIf="!loading && movie" class="details">
        <h2>{{movie.title}}</h2>
        
        <div class="info-grid">
          <div class="info-item">
            <strong>Director:</strong>
            <span>{{movie.directors}}</span>
          </div>
          
          <div class="info-item">
            <strong>Actors:</strong>
            <span>{{movie.actors}}</span>
          </div>
          
          <div class="info-item">
            <strong>Genre:</strong>
            <span>{{movie.genre}}</span>
          </div>
          
          <div class="info-item">
            <strong>Release Date:</strong>
           <span>{{ movie.releaseDate | date:'yyyy-MM-dd' }}</span>

          </div>
          
          <div class="info-item">
            <strong>Runtime:</strong>
            <span>{{movie.runtime}}</span>
          </div>
          
          <div class="info-item" *ngIf="movie.rating">
            <strong>Rating:</strong>
            <span>{{movie.rating}}/10</span>
          </div>
        </div>
        
        <div class="plot-section" *ngIf="movie.plot">
          <strong>Plot:</strong>
          <p>{{movie.plot}}</p>
        </div>
        
        <div class="actions">
          <button [routerLink]="['/edit-movie', movie.id]" class="btn-edit">
            ✏️ Edit Movie
          </button>
          <button (click)="confirmDelete()" class="btn-delete" [disabled]="isDeleting">
            {{ isDeleting ? 'Deleting...' : '🗑️ Delete Movie' }}
          </button>
          <button (click)="back()" class="btn-back">
            ← Back to List
          </button>
        </div>
      </div>
      
      <div *ngIf="!loading && !movie" class="error">
        <p>Movie not found.</p>
        <button (click)="back()" class="btn-back">Go Back</button>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 25px;
      max-width: 900px;
      margin: 0 auto;
    }
    
    .loading {
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

    .loading p {
      color: #666;
      font-size: 16px;
      margin: 0;
    }
    
    .details {
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    h2 {
      color: #2c3e50;
      margin: 0 0 25px 0;
      font-size: 28px;
      border-bottom: 2px solid #007bff;
      padding-bottom: 15px;
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      margin-bottom: 25px;
    }
    
    .info-item {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    
    .info-item strong {
      color: #2c3e50;
      font-size: 14px;
      font-weight: 600;
    }
    
    .info-item span {
      color: #555;
      font-size: 15px;
    }
    
    .plot-section {
      margin: 25px 0;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 6px;
      border-left: 4px solid #007bff;
    }
    
    .plot-section strong {
      display: block;
      color: #2c3e50;
      margin-bottom: 10px;
      font-size: 16px;
    }
    
    .plot-section p {
      color: #555;
      line-height: 1.6;
      margin: 0;
    }
    
    .actions {
      display: flex;
      gap: 12px;
      margin-top: 30px;
      padding-top: 25px;
      border-top: 1px solid #ddd;
    }
    
    button {
      padding: 12px 24px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 15px;
      font-weight: 600;
      transition: all 0.3s;
    }
    
    .btn-edit {
      background: #007bff;
      color: white;
    }
    
    .btn-edit:hover {
      background: #0056b3;
    }
    
    .btn-delete {
      background: #dc3545;
      color: white;
    }
    
    .btn-delete:hover:not(:disabled) {
      background: #c82333;
    }

    .btn-delete:disabled {
      background: #95a5a6;
      cursor: not-allowed;
    }
    
    .btn-back {
      background: #6c757d;
      color: white;
    }
    
    .btn-back:hover {
      background: #5a6268;
    }
    
    .error {
      text-align: center;
      padding: 40px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .error p {
      color: #dc3545;
      font-size: 16px;
      margin-bottom: 20px;
    }

    @media (max-width: 768px) {
      .info-grid {
        grid-template-columns: 1fr;
      }

      .actions {
        flex-direction: column;
      }

      button {
        width: 100%;
      }
    }
  `]
})
export class MovieDetailsComponent implements OnInit {
  movie: Movie | null = null;
  loading = true;
  isDeleting = false;

  constructor(
    private movieService: MovieService,
    private route: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef,
    private notification: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id')!;
    
    this.movieService.getMovieById(id).subscribe({
      next: (data) => {
        this.movie = data;
        this.loading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error loading movie:', err);
        this.notification.showError('Failed to load movie details');
        this.loading = false;
        this.cd.detectChanges();
      }
    });
  }

  confirmDelete() {
    if (!this.movie) return;

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      data: {
        title: 'Delete Movie',
        message: `Are you sure you want to delete "${this.movie.title}"? This action cannot be undone.`,
        confirmText: 'Yes, Delete',
        cancelText: 'No, Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.deleteMovie();
      } else {
        // User clicked No or closed dialog - do nothing
        console.log('Delete cancelled by user');
      }
    });
  }

  deleteMovie() {
    if (!this.movie) return;

    this.isDeleting = true;

    this.movieService.deleteMovie(this.movie.id!).subscribe({
      next: () => {
        this.notification.showSuccess('✅ Movie deleted successfully!');
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Error deleting movie:', err);
        this.notification.showError('❌ Failed to delete movie. Please try again.');
        this.isDeleting = false;
        this.cd.detectChanges();
      }
    });
  }

  back() {
    this.router.navigate(['/']);
  }
}