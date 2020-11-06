import { Routes, RouterModule } from '@angular/router';
import { InstanceMainComponent } from './pages';

const routes: Routes = [
  { path: '', component: InstanceMainComponent },
  { path: ':id', component: InstanceMainComponent },
];

export const InstanceRoutes = RouterModule.forChild(routes);
