import { Routes, RouterModule } from '@angular/router';
import { ErrorMainPage } from './pages';

const routes: Routes = [
  { path: '', component: ErrorMainPage },
];

export const ErrorRoutes = RouterModule.forChild(routes);
