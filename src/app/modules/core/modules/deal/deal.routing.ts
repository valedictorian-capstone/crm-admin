import { Routes, RouterModule } from '@angular/router';
import { DealDetailContainer, DealMainContainer } from './containers';

const routes: Routes = [
  { path: ':id', component: DealDetailContainer },
  { path: '', component: DealMainContainer },
];

export const DealRoutes = RouterModule.forChild(routes);
