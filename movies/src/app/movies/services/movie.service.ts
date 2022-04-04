import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, of, from } from 'rxjs';
import { concatMap, map, mergeMap } from 'rxjs/operators';
import { Movie } from '../models/movie.model';

// Service to operate data related to movies
@Injectable()
export class MovieService {
  private configUrl = 'https://omdbapi.com/';
  private apiKey = '7ed40251';
  private bookmarkedMoviesLocalStorageKey = 'bookmarkedMovies';
  private notFoundErrorMessage = 'Movies not found!';
  private defaultErrorMessage = 'Unexpected error occured.';

  constructor(private http: HttpClient) {}

  // Get list of movies by title.
  // Data sources used:
  //  - http://www.omdbapi.com/?apikey=[yourkey]&s=[title] - to get list of movies by title
  //  - http://www.omdbapi.com/?apikey=[yourkey]&i=[id] - to get rating by movie id
  //  - LocalStorage - to get if movie is bookmarked. It contains list of bookmarked movies.
  public getMovies(title: string): any {
    return this.http
      .get(`${this.configUrl}?apikey=${this.apiKey}&s=${title}`)

      .pipe(
        // get search results - collection of movies
        map((response: any) => {
          if (response.Response === 'False') {
            throw new Error(response.Error);
          }

          return response.Search;
        }),
        // create the collection of movies with all data.
        // To keep an original order of movies (and to show results in the same order), we put http requests to get rating to an array.
        // Then, we execute them at once.
        mergeMap((movies: any) => {
          let tasks: any = [];
          const bookmardedMovies = this.getBookmarkedMovies();

          movies.forEach((movieDto: any) => {
            let movie$ = this.getMovieRating(movieDto.imdbID).pipe(
              map((rating: string) => {
                const isBookmarked = this.isMovieBookmarked(
                  bookmardedMovies,
                  movieDto.imdbID
                );

                return {
                  id: movieDto.imdbID,
                  title: movieDto.Title,
                  year: movieDto.Year,
                  poster: movieDto.Poster,
                  rating: rating,
                  isBookmarked: isBookmarked,
                };
              })
            );
            tasks.push(movie$);
          });

          return forkJoin(tasks);
        })
      );
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
        return this.notFoundErrorMessage;
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
