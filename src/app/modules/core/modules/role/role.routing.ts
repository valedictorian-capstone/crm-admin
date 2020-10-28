import { Routes, RouterModule } from '@angular/router';
import { RoleMainComponent } from './pages';

const routes: Routes = [
  { path: '', component: RoleMainComponent },
];

export const RoleRoutes = RouterModule.forChild(routes);
