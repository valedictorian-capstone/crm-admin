import { Routes, RouterModule } from '@angular/router';
import { CustomerMainComponent, CustomerDetailComponent } from './pages';

const routes: Routes = [
  { path: '', component: CustomerMainComponent },
  { path: ':id', component: CustomerDetailComponent },
];

export const CustomerRoutes = RouterModule.forChild(routes);
