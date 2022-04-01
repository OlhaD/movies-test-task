import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Movie } from '../../models/movie.model';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent implements OnInit {
  @Input() movie: Movie;
  @Output() onUnbookmarked: EventEmitter<string> = new EventEmitter<string>();
  isBookmarked: boolean;

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {}

  onBookmark = (movie: Movie, bookmark: boolean) => {
    if (bookmark) {
      this.movieService.bookmarkMovie(movie);
    } else {
      this.movieService.unBookmarkMovie(movie.id);
      this.onUnbookmarked.emit(movie.id);
    }

    this.movie.isBookmarked = bookmark;
  };
}
