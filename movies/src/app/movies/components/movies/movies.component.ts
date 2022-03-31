import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss'],
})
export class MoviesComponent implements OnInit {
  isHomePage: boolean;

  constructor(
    private location: Location,
    private router: Router
  ) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isHomePage = this.location.path() === '';
      }
    });
  }

  ngOnInit(): void {}
}
