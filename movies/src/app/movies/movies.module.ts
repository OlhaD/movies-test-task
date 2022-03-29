import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NbThemeModule, NbLayoutModule, NbInputModule, NbCardModule, NbIconModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';

import { MoviesRoutingModule } from './movies-routing.module';
import { MoviesComponent } from './components/movies/movies.component';
import { MoviesListPageComponent } from './pages/movies-list-page/movies-list-page.component';
import { MoviesBookmarkedPageComponent } from './pages/movies-bookmarked-page/movies-bookmarked-page.component';
import { MovieCardComponent } from './components/movie-card/movie-card.component';
import { SearchFormComponent } from './components/search-form/search-form.component';

@NgModule({
  declarations: [
    MoviesComponent,
    MoviesListPageComponent,
    MoviesBookmarkedPageComponent,
    MovieCardComponent,
    SearchFormComponent
  ],
  imports: [
    FormsModule,
    MoviesRoutingModule,
    
    NbThemeModule.forRoot({ name: 'default' }),
    NbLayoutModule,
    NbInputModule,
    NbCardModule,
    NbIconModule,
    NbEvaIconsModule
  ],
  exports: [MoviesComponent],
  providers: []
})
export class MoviesModule { }