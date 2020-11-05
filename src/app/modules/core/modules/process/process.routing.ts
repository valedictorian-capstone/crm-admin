import { Routes, RouterModule } from '@angular/router';
import { ProcessMainComponent, ProcessDetailComponent } from './pages';

const routes: Routes = [
  { path: '', component: ProcessMainComponent },
  { path: ':id', component: ProcessDetailComponent },
];

export const ProcessRoutes = RouterModule.forChild(routes);
