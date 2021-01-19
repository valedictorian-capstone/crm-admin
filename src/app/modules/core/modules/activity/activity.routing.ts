import { Routes, RouterModule } from '@angular/router';
import { ActivityMainContainer } from './containers';

const routes: Routes = [
  { path: '', component: ActivityMainContainer },
];

export const ActivityRoutes = RouterModule.forChild(routes);
