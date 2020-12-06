import { Routes, RouterModule } from '@angular/router';
import { RoleMainPage } from './pages';

const routes: Routes = [
  { path: '', component: RoleMainPage },
];

export const RoleRoutes = RouterModule.forChild(routes);
