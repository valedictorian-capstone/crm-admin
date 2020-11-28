import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SearchResultComponent } from '..';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  @ViewChild('searchRef') searchRef: SearchResultComponent;
  search = new FormControl('');
  stage = '';
  showSearch = false;
  constructor() { }

  ngOnInit() {
    this.search.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
      ).subscribe((data) => {
        this.searchRef.useSearch(data);
      });
  }

}
