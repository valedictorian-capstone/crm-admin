import { Routes, RouterModule } from '@angular/router';
import { LeadMainContainer } from './containers';

const routes: Routes = [
  { path: '', component: LeadMainContainer },
];

export const LeadRoutes = RouterModule.forChild(routes);
