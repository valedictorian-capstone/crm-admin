import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { IProductMainState } from '@extras/features/product';

@Component({
  selector: 'app-product-page-count',
  templateUrl: './product-page-count.component.html',
  styleUrls: ['./product-page-count.component.scss']
})
export class ProductPageCountComponent {
  @Output() useSelectPageCount: EventEmitter<any> = new EventEmitter<any>();
  @Input() state: IProductMainState;
}
