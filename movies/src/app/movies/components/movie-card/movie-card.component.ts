import { Component, Input, OnInit } from '@angular/core';
import { Movie } from '../../models/movie.model';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent implements OnInit {
  @Input() movie: Movie;
  isBookmarked: boolean;

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {}

  onBookmark = (id: string, bookmark: boolean) => {
    bookmark
      ? this.movieService.bookmarkMovie(id)
      : this.movieService.unBookmarkMovie(id);

    this.movie.isBookmarked = bookmark;
  };
}
