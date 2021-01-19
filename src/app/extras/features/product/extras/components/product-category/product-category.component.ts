import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.scss']
})
export class ProductCategoryComponent {
  constructor(
    protected readonly router: Router
  ) { }

  useRoute() {
    this.router.navigate(['core/category']);
  }
}
