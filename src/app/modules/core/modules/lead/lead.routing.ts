import { Routes, RouterModule } from '@angular/router';
import { LeadMainPage } from './pages';

const routes: Routes = [
  { path: '', component: LeadMainPage },
];

export const LeadRoutes = RouterModule.forChild(routes);
