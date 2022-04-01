import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Movie } from '../models/movie.model';

@Injectable()
export class MovieService {
  private configUrl = 'https://omdbapi.com/';
  private apiKey = '7ed40251';
  private bookmarkedMoviesLocalStorageKey = 'bookmarkedMovies';
  private defaultErrorMessage = 'Unexpected error occured';

  constructor(private http: HttpClient) {}

  public getMovies(title: string): Observable<Movie[]> {
    let movies: Movie[] = [];
    return this.http
      .get(`${this.configUrl}?apikey=${this.apiKey}&s=${title}`)
      .pipe(
        map((response: any) => {
          if (response.Response === 'False') {
            throw new Error(this.getErrorMessage(response.Error));
          }

          const list = response.Search;
          const bookmardedMovies = this.getBookmardedMovies();
          for (let movieDto of list) {
            const isBookmarked = this.isMovieBookmarked(
              bookmardedMovies,
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

          return movies;
        })
      )
  }

  private isMovieBookmarked(
    bookmardedMovies: Movie[],
    movieId: string
  ): boolean {
    return bookmardedMovies.findIndex((x) => x.id === movieId) > -1;
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

  public bookmarkMovie(movie: Movie): void {
    let bookmardedMovies: Movie[] = this.getBookmardedMovies();

    movie.isBookmarked = true;

    bookmardedMovies.push(movie);
    localStorage.setItem(
      this.bookmarkedMoviesLocalStorageKey,
      JSON.stringify(bookmardedMovies)
    );
  }

  public getBookmardedMovies(): Movie[] {
    let bookmarkedMoviesStr = localStorage.getItem(
      this.bookmarkedMoviesLocalStorageKey
    );
    if (bookmarkedMoviesStr == null) {
      return [];
    }

    return JSON.parse(bookmarkedMoviesStr);
  }

  public unBookmarkMovie(id: string): void {
    let bookmardedMovies: Movie[] = this.getBookmardedMovies();
    bookmardedMovies = this.removeFromArray(bookmardedMovies, id);

    localStorage.setItem(
      this.bookmarkedMoviesLocalStorageKey,
      JSON.stringify(bookmardedMovies)
    );
  }

  private removeFromArray(arr: Movie[], id: string): Movie[] {
    const index = arr.findIndex((x) => x.id === id);
    if (index > -1) {
      arr.splice(index, 1);
    }

    return arr;
  }

  // Error message can only have predefined value.
  private getErrorMessage(message: string) {
    switch (message) {
      case 'Movie not found!': {
        return message;
      }
      case 'Too many results.': {
        return message;
      }
      default: {
        return this.defaultErrorMessage;
      }
    }
  }
}
