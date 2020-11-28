import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProductService } from '@services';
import { ProductVM } from '@view-models';

@Component({
  selector: 'app-reuse-product-select',
  templateUrl: './product-select.component.html',
  styleUrls: ['./product-select.component.scss']
})
export class ProductSelectComponent implements OnInit {
  @Output() useSelect: EventEmitter<ProductVM> = new EventEmitter<ProductVM>();
  @Output() useAdd: EventEmitter<string> = new EventEmitter<string>();
  @Input() template: HTMLElement;
  @Input() selected: ProductVM;
  value = '';
  products: ProductVM[] = [];
  filterProducts: ProductVM[] = [];
  stage = 'finding';
  constructor(
    protected readonly productService: ProductService,
  ) { }

  ngOnInit() {
    this.productService.findAll().subscribe((data) => {
      this.products = data;
      setTimeout(() => {
        this.stage = 'done';
        this.filterProducts = data;
      }, 500);
    });
    setTimeout(() => {
      this.stage = 'done';
    }, 500);
  }

  useChangeValue = (value: string) => {
    this.stage = 'finding';
    setTimeout(() => {
      this.value = value;
      this.filterProducts = this.products.filter((product) => product.name.toLowerCase().includes(value.toLowerCase()));
      this.stage = 'done';
    }, 500);
  }
}
