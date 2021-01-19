import { Routes, RouterModule } from '@angular/router';
import { CategoryMainContainer } from './containers';

const routes: Routes = [
  { path: '', component: CategoryMainContainer },
];

export const CategoryRoutes = RouterModule.forChild(routes);
