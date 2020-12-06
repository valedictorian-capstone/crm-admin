import { Routes, RouterModule } from '@angular/router';
import { DashboardMainPage } from './pages';

const routes: Routes = [
  { path: '', component: DashboardMainPage },
];

export const DashboardRoutes = RouterModule.forChild(routes);
