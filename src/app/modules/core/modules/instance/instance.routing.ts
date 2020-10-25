import { Routes, RouterModule } from '@angular/router';
import { InstanceMainComponent, InstanceDetailComponent } from './pages';

const routes: Routes = [
  { path: '', component: InstanceMainComponent },
  { path: ':id', component: InstanceDetailComponent },
];

export const InstanceRoutes = RouterModule.forChild(routes);
