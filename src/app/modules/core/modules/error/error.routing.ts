import { Routes, RouterModule } from '@angular/router';
import { ErrorMainComponent } from './pages';

const routes: Routes = [
  { path: '', component: ErrorMainComponent },
];

export const ErrorRoutes = RouterModule.forChild(routes);
