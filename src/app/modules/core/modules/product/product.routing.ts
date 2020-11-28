import { Routes, RouterModule } from '@angular/router';
import { ProductMainPage } from './pages';

const routes: Routes = [
  { path: '', component: ProductMainPage },
];

export const ProductRoutes = RouterModule.forChild(routes);
