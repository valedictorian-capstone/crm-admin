import { Routes, RouterModule } from '@angular/router';
import { ProductMainComponent, ProductDetailComponent } from './pages';

const routes: Routes = [
  { path: '', component: ProductMainComponent },
  { path: ':id', component: ProductDetailComponent },
];

export const ProductRoutes = RouterModule.forChild(routes);
