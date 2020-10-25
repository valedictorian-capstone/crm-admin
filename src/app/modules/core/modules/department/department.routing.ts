import { Routes, RouterModule } from '@angular/router';
import { DepartmentMainComponent, DepartmentDetailComponent } from './pages';

const routes: Routes = [
  { path: '', component: DepartmentMainComponent },
  { path: ':id', component: DepartmentDetailComponent },
];

export const DepartmentRoutes = RouterModule.forChild(routes);
