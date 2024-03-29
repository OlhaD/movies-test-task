import { Component, OnInit } from '@angular/core';
import { Movie } from '../../models/movie.model';
import { MovieService } from '../../services/movie.service';

// Page component with list of bookmarked movies
@Component({
  selector: 'app-movies-bookmarked-page',
  templateUrl: './movies-bookmarked-page.component.html',
  styleUrls: ['./movies-bookmarked-page.component.scss'],
})
export class MoviesBookmarkedPageComponent implements OnInit {
  noBookmarkedMoviesMessage: string = 'You do not have bookmarked movies yet.';
  movies: Movie[];

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.initBookmarkedMovies();
  }

  // Initialize collection of bookmarked movies with movies from LocalStorage
  initBookmarkedMovies = () => {
    this.movies = this.movieService.getBookmarkedMovies();
  };
}
