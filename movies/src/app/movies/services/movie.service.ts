import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Movie } from '../models/movie.model';
import { MovieDto } from './movieDto';

@Injectable()
export class MovieService {
  private configUrl = 'https://omdbapi.com/';
  private apiKey = '7ed40251';
  private bookmarkedMoviesLocalStorageKey = 'bookmarkedMoviesIds';
  private localStorageSeparator = ',';
  private movies: Movie[] = [];

  constructor(private http: HttpClient) {}

  public getMovies(title: string): Movie[] {
    let movies: Movie[] = [];
    this.http
      .get(`${this.configUrl}?apikey=${this.apiKey}&s=${title}`)
      .subscribe((x: any) => {
        const list = x.Search;
        const bookmardedMoviesIds = this.getBookmardedMoviesIds();
        for (let movieDto of list) {
          const isBookmarked = this.isMovieBookmarked(
            bookmardedMoviesIds,
            movieDto.imdbID
          );
          this.getMovieRating(movieDto.imdbID).subscribe((rating) => {
            movieDto.imdbRating = rating;

            let movie: Movie = {
              id: movieDto.imdbID,
              title: movieDto.Title,
              year: movieDto.Year,
              poster: movieDto.Poster,
              rating: movieDto.imdbRating,
              isBookmarked: isBookmarked,
            };
            movies.push(movie);
          });
        }
      });

    return movies;
  }

  private isMovieBookmarked(
    bookmardedMoviesIds: string[],
    movieId: string
  ): boolean {
    return bookmardedMoviesIds.includes(movieId);
  }

  private getMovieRating(id: string): Observable<string> {
    return this.http
      .get(`${this.configUrl}?apikey=${this.apiKey}&i=${id}`)
      .pipe(
        map((x: any) => {
          return x.imdbRating;
        })
      );
  }

  public bookmarkMovie(id: string): void {
    let bookmardedMovies: string[] = this.getBookmardedMoviesIds();

    bookmardedMovies.push(id);
    localStorage.setItem(
      this.bookmarkedMoviesLocalStorageKey,
      bookmardedMovies.toString()
    );
  }

  private getBookmardedMoviesIds(): string[] {
    let bookmarkedMoviesStr = localStorage.getItem(
      this.bookmarkedMoviesLocalStorageKey
    );
    if (bookmarkedMoviesStr == null) {
      return [];
    }

    return bookmarkedMoviesStr.split(this.localStorageSeparator);
  }

  public unBookmarkMovie(id: string): void {
    let bookmardedMoviesIds: string[] = this.getBookmardedMoviesIds();
    bookmardedMoviesIds = this.removeFromArray(bookmardedMoviesIds, id);    

    localStorage.setItem(
      this.bookmarkedMoviesLocalStorageKey,
      bookmardedMoviesIds.toString()
    );
  }

  private removeFromArray(arr: string[], element: string): string[]{
    const index = arr.indexOf(element, 0);
    if (index > -1) {
      arr.splice(index, 1);
    }

    return arr;
  }
}
