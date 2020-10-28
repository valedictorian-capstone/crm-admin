import { Routes, RouterModule } from '@angular/router';
import { EmployeeMainComponent } from './pages';

const routes: Routes = [
  { path: '', component: EmployeeMainComponent },
];

export const EmployeeRoutes = RouterModule.forChild(routes);
