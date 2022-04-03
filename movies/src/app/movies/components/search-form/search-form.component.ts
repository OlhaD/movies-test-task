import { Component, EventEmitter, OnInit, Output } from '@angular/core';

// Component for searching the movie by title
@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss'],
})
export class SearchFormComponent implements OnInit {
  @Output() onSearch: EventEmitter<string> = new EventEmitter<string>();
  searchText: string = '';

  constructor() {}

  ngOnInit(): void {}

  onSearchClick = () => {
    this.onSearch.emit(this.searchText);
  };
}
