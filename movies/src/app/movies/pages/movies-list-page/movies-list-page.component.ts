import { Component, OnInit } from '@angular/core';
import { Movie } from '../../models/movie.model';
import { MovieService } from '../../services/movie.service';

// Page component with search and list of movies (search results)
@Component({
  selector: 'app-movies-list-page',
  templateUrl: './movies-list-page.component.html',
  styleUrls: ['./movies-list-page.component.scss'],
})
export class MoviesListPageComponent implements OnInit {
  isLoading: boolean = true;
  movies: Movie[] = [];
  errorMessage: string;

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.isLoading = false;
  }

  // Show list of movies which are search results
  showMovies = (searchText: string) => {
    if (!searchText) {
      return;
    }

    this.isLoading = true;
    this.movieService.getMovies(searchText).subscribe({
      next: (res: any) => {
        this.movies = res;
        this.errorMessage = '';
      },
      error: (err: any) => {
        this.errorMessage = this.movieService.getPublicErrorMessage(
          err.message
        );
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  };
}
