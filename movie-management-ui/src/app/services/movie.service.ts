import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movie } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  // UPDATED TO YOUR BACKEND URL
private apiUrl = 'http://localhost:5000/api/movies';

  constructor(private http: HttpClient) {
    console.log('MovieService initialized with URL:', this.apiUrl);
  }

  getLatestMovies(): Observable<Movie[]> {
    const url = `${this.apiUrl}/latest`;
    console.log('Fetching from:', url);
    return this.http.get<Movie[]>(url);
  }

  getMovieById(id: number): Observable<Movie> {
    return this.http.get<Movie>(`${this.apiUrl}/${id}`);
  }

  createMovie(movie: Movie): Observable<Movie> {
    return this.http.post<Movie>(this.apiUrl, movie);
  }

  updateMovie(id: number, movie: Movie): Observable<Movie> {
    return this.http.put<Movie>(`${this.apiUrl}/${id}`, movie);
  }

  deleteMovie(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchMovies(searchType: string, searchValue: string): Observable<Movie[]> {
  console.log(`🔍 Searching - Type: ${searchType}, Value: ${searchValue}`);
  
  const params = new HttpParams()
    .set('searchType', searchType)
    .set('searchValue', searchValue);
  
  return this.http.get<Movie[]>(`${this.apiUrl}/search`, { params });
}
}