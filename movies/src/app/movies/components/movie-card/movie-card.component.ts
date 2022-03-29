import { Component, OnInit } from '@angular/core';
import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {
  testMovie: Movie = {
    id: "tt13175494",
    title: "Estonia - funnet som endrer alt",
    year: 2020,
    poster: "https://m.media-amazon.com/images/M/MV5BMDhhZTJhNTgtOGZmNy00MzZhLWI1M2EtNTRkMDI4MTQ3ZTdhXkEyXkFqcGdeQXVyMjUwMzU2Mjc@._V1_SX300.jpg",
    rating: "7.3"
  };

  constructor() { }

  ngOnInit(): void {
  }

  onBookmark = () => {
    
  }
}
