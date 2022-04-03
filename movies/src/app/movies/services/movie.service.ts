import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Movie } from '../models/movie.model';

// Service to operate data related to movies
@Injectable()
export class MovieService {
  private configUrl = 'https://omdbapi.com/';
  private apiKey = '7ed40251';
  private bookmarkedMoviesLocalStorageKey = 'bookmarkedMovies';
  private defaultErrorMessage = 'Unexpected error occured.';

  constructor(private http: HttpClient) {}

  // Get list of movies by title.
  // Data sources used:
  //  - http://www.omdbapi.com/?apikey=[yourkey]&s=[title] - to get list of movies by title
  //  - http://www.omdbapi.com/?apikey=[yourkey]&i=[id] - to get rating by movie id
  //  - localStorage - to get if movie is bookmarked
  public getMovies(title: string): Observable<Movie[]> {
    return this.http
      .get(`${this.configUrl}?apikey=${this.apiKey}&s=${title}`)
      .pipe(
        map((response: any) => {
          if (response.Response === 'False') {
            throw new Error(response.Error);
          }

          return this.getMoviesWithDetails(response.Search);
        })
      );
  }

  // Get Movie with all details.
  // Rating is taken from the API. Example: http://www.omdbapi.com/?apikey=[yourkey]&i=[id]
  // "isBookmarked" is taken from LocalStorage. It contains list of bookmarked movies.
  private getMoviesWithDetails(moviesResp: any): Movie[] {
    let movies: Movie[] = [];
    const bookmardedMovies = this.getBookmarkedMovies();

    for (let movieDto of moviesResp) {
      const isBookmarked = this.isMovieBookmarked(
        bookmardedMovies,
        movieDto.imdbID
      );
      this.getMovieRating(movieDto.imdbID).subscribe((rating) => {
        movies.push({
          id: movieDto.imdbID,
          title: movieDto.Title,
          year: movieDto.Year,
          poster: movieDto.Poster,
          rating: rating,
          isBookmarked: isBookmarked,
        });
      });
    }

    return movies;
  }

  // Check if movie is bookmarked
  private isMovieBookmarked(
    bookmardedMovies: Movie[],
    movieId: string
  ): boolean {
    return bookmardedMovies.findIndex((x) => x.id === movieId) > -1;
  }

  // Get movie rating by id
  private getMovieRating(id: string): Observable<string> {
    return this.http
      .get(`${this.configUrl}?apikey=${this.apiKey}&i=${id}`)
      .pipe(
        map((x: any) => {
          return x.imdbRating;
        })
      );
  }

  // Mark movie as bookmarked and add it to the movies collection in LocalStorage
  public bookmarkMovie(movie: Movie): void {
    let bookmardedMovies: Movie[] = this.getBookmarkedMovies();

    movie.isBookmarked = true;

    bookmardedMovies.push(movie);
    localStorage.setItem(
      this.bookmarkedMoviesLocalStorageKey,
      JSON.stringify(bookmardedMovies)
    );
  }

  // Get list of bookmarked movies from LocalStorage
  public getBookmarkedMovies(): Movie[] {
    let bookmarkedMoviesStr = localStorage.getItem(
      this.bookmarkedMoviesLocalStorageKey
    );

    return bookmarkedMoviesStr ? JSON.parse(bookmarkedMoviesStr) : [];
  }

  // Remove the movie from the bookmarked movies collection in LocalStorage
  public unBookmarkMovie(id: string): void {
    let bookmardedMovies: Movie[] = this.getBookmarkedMovies();
    bookmardedMovies = this.removeFromArray(bookmardedMovies, id);

    localStorage.setItem(
      this.bookmarkedMoviesLocalStorageKey,
      JSON.stringify(bookmardedMovies)
    );
  }

  // Remove the movie from the array of movies
  private removeFromArray(arr: Movie[], id: string): Movie[] {
    const index = arr.findIndex((x) => x.id === id);
    if (index > -1) {
      arr.splice(index, 1);
    }

    return arr;
  }

  // Error message can only have predefined value. It is needed not to expose internal error messages to UI
  public getPublicErrorMessage(message: string): string {
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
