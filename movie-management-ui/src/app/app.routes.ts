import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MovieDetailsComponent } from './components/movie-details/movie-details.component';
import { MovieFormComponent } from './components/movie-form/movie-form.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'movie/:id', component: MovieDetailsComponent },
  { path: 'add-movie', component: MovieFormComponent },
  { path: 'edit-movie/:id', component: MovieFormComponent },
  { path: '**', redirectTo: '' }
];