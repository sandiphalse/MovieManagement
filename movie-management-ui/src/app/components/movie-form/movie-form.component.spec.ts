import { TestBed, ComponentFixture } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ActivatedRoute, Router } from '@angular/router';

import { MovieFormComponent } from './movie-form.component';
import { MovieService } from '../../services/movie.service';
import { NotificationService } from '../../services/notification.service';

describe('MovieFormComponent', () => {
let component: MovieFormComponent;
let fixture: ComponentFixture<MovieFormComponent>;

const mockMovie = {
id: 1,
title: 'Inception',
actors: 'Leonardo DiCaprio',
directors: 'Christopher Nolan',
releaseDate: '2010-07-16',
runtime: '02:28:00',
genre: 'SciFi',
plot: 'Dreams inside dreams',
rating: 9,
imageUrl: ''
};

const movieServiceMock = {
getMovieById: vi.fn().mockReturnValue(of(mockMovie)),
createMovie: vi.fn().mockReturnValue(of({})),
updateMovie: vi.fn().mockReturnValue(of({}))
};

const routerMock = {
navigate: vi.fn()
};

const notificationMock = {
showSuccess: vi.fn(),
showError: vi.fn(),
showWarning: vi.fn()
};

const activatedRouteMock = {
snapshot: {
paramMap: {
get: vi.fn().mockReturnValue(null) // default = Add mode
}
}
};

beforeEach(async () => {
await TestBed.configureTestingModule({
imports: [MovieFormComponent],
providers: [
{ provide: MovieService, useValue: movieServiceMock },
{ provide: Router, useValue: routerMock },
{ provide: NotificationService, useValue: notificationMock },
{ provide: ActivatedRoute, useValue: activatedRouteMock }
]
}).compileComponents();


fixture = TestBed.createComponent(MovieFormComponent);
component = fixture.componentInstance;
fixture.detectChanges();


});

it('should create component', () => {
expect(component).toBeTruthy();
});

it('should start in add mode when no id present', () => {
expect(component.isEdit).toBe(false);
});

it('should load movie in edit mode', () => {
activatedRouteMock.snapshot.paramMap.get.mockReturnValue('1');
component.ngOnInit();

expect(component.isEdit).toBe(true);
expect(movieServiceMock.getMovieById).toHaveBeenCalledWith(1);


});



it('should call createMovie on submit in add mode', () => {
const formMock = {
invalid: false,
controls: {
title: { markAsTouched: vi.fn() }
}
};


component.movie = mockMovie;
component.isEdit = false;

component.onSubmit(formMock);

expect(movieServiceMock.createMovie).toHaveBeenCalled();


});

it('should call updateMovie on submit in edit mode', () => {
const formMock = {
invalid: false,
controls: {
title: { markAsTouched: vi.fn() }
}
};


component.movie = mockMovie;
component.isEdit = true;
component.movieId = 1;

component.onSubmit(formMock);

expect(movieServiceMock.updateMovie).toHaveBeenCalledWith(1, expect.any(Object));


});

it('should show warning if form invalid', () => {
const formMock = {
invalid: true,
controls: {}
};


component.onSubmit(formMock);

expect(notificationMock.showWarning).toHaveBeenCalled();

});

it('should navigate home on cancel()', () => {
component.cancel();
expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
});

it('should show error on load failure', () => {
movieServiceMock.getMovieById.mockReturnValueOnce(
throwError(() => new Error('Load failed'))
);


component.loadMovie(1);

expect(notificationMock.showError).toHaveBeenCalled();


});
});
