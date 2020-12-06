import { Routes, RouterModule } from '@angular/router';
import { ProductDetailPage, ProductMainPage } from './pages';

const routes: Routes = [
  { path: ':id', component: ProductDetailPage },
  { path: '', component: ProductMainPage },
];

export const ProductRoutes = RouterModule.forChild(routes);
