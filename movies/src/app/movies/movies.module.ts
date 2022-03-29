import { NgModule } from '@angular/core';

import { MoviesRoutingModule } from './movies-routing.module';
import { MoviesComponent } from './components/movies/movies.component';
import { MoviesListPageComponent } from './pages/movies-list-page/movies-list-page.component';
import { MoviesBookmarkedPageComponent } from './pages/movies-bookmarked-page/movies-bookmarked-page.component';

@NgModule({
  declarations: [
    MoviesComponent,
    MoviesListPageComponent,
    MoviesBookmarkedPageComponent
  ],
  imports: [
    MoviesRoutingModule
  ],
  exports: [MoviesComponent],
  providers: []
})
export class MoviesModule { }