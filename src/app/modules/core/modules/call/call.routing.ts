import { Routes, RouterModule } from '@angular/router';
import { CallMainPage } from './pages';

const routes: Routes = [
  { path: '', component: CallMainPage },
];

export const CallRoutes = RouterModule.forChild(routes);
