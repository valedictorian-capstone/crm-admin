import { NgModule } from '@angular/core';
import { ExtrasModule } from '@extras/extras.module';
import {
  ProductCreateComponent,
  ProductListComponent,
  ProductUpdateComponent
} from './components';
import { ProductRoutes } from './product.routing';
import {
  ProductMainComponent,
  ProductDetailComponent
} from './pages';

const COMPONENTS = [
  ProductCreateComponent,
  ProductListComponent,
  ProductUpdateComponent,
];
const PAGES = [
  ProductMainComponent,
  ProductDetailComponent
];
@NgModule({
  imports: [
    ExtrasModule.forRoot(),
    ProductRoutes,
  ],
  declarations: [...COMPONENTS, ...PAGES]
})
export class ProductModule { }
