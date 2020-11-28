import { Routes, RouterModule } from '@angular/router';
import { DealDetailPage, DealMainPage } from './pages';

const routes: Routes = [
  { path: ':id', component: DealDetailPage },
  { path: '', component: DealMainPage },
];

export const DealRoutes = RouterModule.forChild(routes);
