import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MoviesBookmarkedPageComponent } from './pages/movies-bookmarked-page/movies-bookmarked-page.component';
import { MoviesListPageComponent } from './pages/movies-list-page/movies-list-page.component';

const routes: Routes = [
  { path: '', component: MoviesListPageComponent },
  { path: 'search', component: MoviesListPageComponent },
  { path: 'bookmarked', component: MoviesBookmarkedPageComponent },
];

// Movies routing module
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MoviesRoutingModule {}
