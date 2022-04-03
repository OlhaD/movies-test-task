import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

// Root page for Movie module
@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss'],
})
export class MoviesComponent implements OnInit {
  isHomePage: boolean;

  constructor(private router: Router, private location: Location) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isHomePage = this.location.path() === '';
      }
    });
  }

  ngOnInit(): void {}
}
