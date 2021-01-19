import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category-product',
  templateUrl: './category-product.component.html',
  styleUrls: ['./category-product.component.scss']
})
export class CategoryProductComponent {
  constructor(
    protected readonly router: Router
  ) { }

  useRoute() {
    this.router.navigate(['core/product']);
  }
}
