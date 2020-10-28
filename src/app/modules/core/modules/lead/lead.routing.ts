import { Routes, RouterModule } from '@angular/router';
import { LeadMainComponent } from './pages';

const routes: Routes = [
  { path: '', component: LeadMainComponent },
];

export const LeadRoutes = RouterModule.forChild(routes);
