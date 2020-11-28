import { Routes, RouterModule } from '@angular/router';
import { ActivityMainPage } from './pages';

const routes: Routes = [
  { path: '', component: ActivityMainPage },
];

export const ActivityRoutes = RouterModule.forChild(routes);
