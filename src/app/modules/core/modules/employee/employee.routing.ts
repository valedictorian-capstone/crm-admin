import { Routes, RouterModule } from '@angular/router';
import { EmployeeMainPage } from './pages';

const routes: Routes = [
  { path: '', component: EmployeeMainPage },
];

export const EmployeeRoutes = RouterModule.forChild(routes);
