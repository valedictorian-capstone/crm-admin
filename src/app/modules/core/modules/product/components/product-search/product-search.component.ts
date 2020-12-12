import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.scss']
})
export class ProductSearchComponent {
  @Output() useSearch: EventEmitter<any> = new EventEmitter<any>();
  @Input() search = {
    value: '',
    category: undefined
  };
}
