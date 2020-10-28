import { Routes, RouterModule } from '@angular/router';
import { ServiceMainComponent, ServiceDetailComponent } from './pages';

const routes: Routes = [
  { path: '', component: ServiceMainComponent },
  { path: ':id', component: ServiceDetailComponent },
];

export const ServiceRoutes = RouterModule.forChild(routes);
