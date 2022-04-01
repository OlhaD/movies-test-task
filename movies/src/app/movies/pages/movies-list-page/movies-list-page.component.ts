import { Component, OnInit } from '@angular/core';
import { Movie } from '../../models/movie.model';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-movies-list-page',
  templateUrl: './movies-list-page.component.html',
  styleUrls: ['./movies-list-page.component.scss'],
})
export class MoviesListPageComponent implements OnInit {
  movies: Movie[] = [];
  errorMessage: string;

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {}

  showMovies = (searchText: string) => {
    this.movieService.getMovies(searchText).subscribe({
      next: (res: any) => {
        this.movies = res;
        this.errorMessage = "";
      },
      error: (err: any) => {
        this.errorMessage = err.message;
      },
    });
  };
}
