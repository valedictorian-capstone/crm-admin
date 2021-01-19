import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ICategorySearch } from '@extras/features/category';
@Component({
  selector: 'app-category-query',
  templateUrl: './category-query.component.html',
  styleUrls: ['./category-query.component.scss']
})
export class CategoryQueryComponent {
  @Input() search: ICategorySearch;
  @Input() isMain: boolean;
  @Output() useSearch: EventEmitter<ICategorySearch> = new EventEmitter<ICategorySearch>();
  useClear = () => {
    this.search = {
      name: '',
    };
    this.useSearch.emit(this.search);
  }
}
