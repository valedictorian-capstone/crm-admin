import { Routes, RouterModule } from '@angular/router';
import { WorkFlowMainComponent, WorkFlowDetailComponent } from './pages';

const routes: Routes = [
  { path: '', component: WorkFlowMainComponent },
  { path: ':id', component: WorkFlowDetailComponent },
];

export const WorkFlowRoutes = RouterModule.forChild(routes);
