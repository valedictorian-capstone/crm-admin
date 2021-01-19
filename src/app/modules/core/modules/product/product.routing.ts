import { Routes, RouterModule } from '@angular/router';
import { ProductDetailPage, ProductMainPage } from './pages';
import { ProductMainContainer } from './containers';

const routes: Routes = [
  { path: ':id', component: ProductDetailPage },
  { path: '', component: ProductMainContainer },
];

export const ProductRoutes = RouterModule.forChild(routes);
