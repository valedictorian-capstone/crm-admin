import { Routes, RouterModule } from '@angular/router';
import { EmployeeMainContainer } from './containers';

const routes: Routes = [
  { path: '', component: EmployeeMainContainer },
];

export const EmployeeRoutes = RouterModule.forChild(routes);
