import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoviesBookmarkedPageComponent } from './movies-bookmarked-page.component';

describe('MoviesBookmarkedPageComponent', () => {
  let component: MoviesBookmarkedPageComponent;
  let fixture: ComponentFixture<MoviesBookmarkedPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoviesBookmarkedPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoviesBookmarkedPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
