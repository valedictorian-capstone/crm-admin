import { Routes, RouterModule } from '@angular/router';
import { ProductDetailPage, ProductMainPage } from './pages';
import { ProductMainContainer, ProductDetailContainer } from './containers';

const routes: Routes = [
  { path: ':id', component: ProductDetailContainer },
  { path: '', component: ProductMainContainer },
];

export const ProductRoutes = RouterModule.forChild(routes);
