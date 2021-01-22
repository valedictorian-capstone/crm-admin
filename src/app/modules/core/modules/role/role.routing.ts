import { Routes, RouterModule } from '@angular/router';
import { RoleMainContainer } from './containers';

const routes: Routes = [
  { path: '', component: RoleMainContainer },
];

export const RoleRoutes = RouterModule.forChild(routes);
