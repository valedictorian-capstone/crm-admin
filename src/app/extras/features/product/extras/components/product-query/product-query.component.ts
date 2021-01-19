import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { IProductSearch } from '@extras/features/product';

@Component({
  selector: 'app-product-query',
  templateUrl: './product-query.component.html',
  styleUrls: ['./product-query.component.scss']
})
export class ProductQueryComponent {
  @Input() search: IProductSearch;
  @Input() isMain: boolean;
  @Output() useSearch: EventEmitter<IProductSearch> = new EventEmitter<IProductSearch>();
  useClear = () => {
    this.search = {
      name: '',
    };
    this.useSearch.emit(this.search);
  }
}
