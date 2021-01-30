import { NgModule } from '@angular/core';
import { ExtrasModule } from '@extras/extras.module';
import {
  ProductItemComponent,
  ProductRestoreComponent,
  ProductSearchComponent
} from './components';
import {
  ProductMainPage,
  ProductDetailPage
} from './pages';
import {
  ProductMainContainer,
  ProductDetailContainer
} from './containers';
// import { } from './directives';
// import { } from './pipes';
import { ProductRoutes } from './product.routing';
const COMPONENTS = [
  ProductItemComponent,
  ProductRestoreComponent,
  ProductSearchComponent
];
const CONTAINERS = [ProductMainContainer, ProductDetailContainer];
const PAGES = [
  ProductMainPage,
  ProductDetailPage
];

const PIPES = [

];

const DIRECTIVES = [

];
@NgModule({
  imports: [
    ExtrasModule.forChild(),
    ProductRoutes
  ],
  declarations: [...PAGES, ...COMPONENTS, ...PIPES, ...DIRECTIVES, ...CONTAINERS]
})
export class ProductModule { }
