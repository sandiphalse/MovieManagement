import { TestBed, ComponentFixture } from '@angular/core/testing';
import { of } from 'rxjs';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { MovieDetailsComponent } from './movie-details.component';
import { MovieService } from '../../services/movie.service';
import { NotificationService } from '../../services/notification.service';

describe('MovieDetailsComponent', () => {
let component: MovieDetailsComponent;
let fixture: ComponentFixture<MovieDetailsComponent>;

// ---- MOCK DATA ----
const mockMovie = {
id: 1,
title: 'Inception',
directors: 'Christopher Nolan',
actors: 'Leonardo DiCaprio',
genre: 'SciFi',
releaseDate: new Date(),
runtime: 148,
rating: 9,
plot: 'Dream within dream'
};

// ---- MOCK SERVICES ----
const movieServiceMock = {
getMovieById: vi.fn().mockReturnValue(of(mockMovie)),
deleteMovie: vi.fn().mockReturnValue(of(null))
};

const notificationMock = {
showSuccess: vi.fn(),
showError: vi.fn()
};

const routerMock = {
navigate: vi.fn()
};

const activatedRouteMock = {
snapshot: {
paramMap: {
get: () => '1'
}
}
};

const dialogMock = {
open: vi.fn().mockReturnValue({
afterClosed: () => of(true)
})
};

beforeEach(async () => {
await TestBed.configureTestingModule({
imports: [MovieDetailsComponent],
providers: [
{ provide: MovieService, useValue: movieServiceMock },
{ provide: NotificationService, useValue: notificationMock },
{ provide: Router, useValue: routerMock },
{ provide: ActivatedRoute, useValue: activatedRouteMock },
{ provide: MatDialog, useValue: dialogMock }
]
}).compileComponents();


fixture = TestBed.createComponent(MovieDetailsComponent);
component = fixture.componentInstance;
fixture.detectChanges();

});

it('should create component', () => {
expect(component).toBeTruthy();
});

it('should load movie on init', () => {
expect(movieServiceMock.getMovieById).toHaveBeenCalledWith(1);
expect(component.movie?.title).toBe('Inception');
});



it('should navigate back after delete', () => {
component.deleteMovie();
expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
});

it('should navigate back on back()', () => {
component.back();
expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
});
});
