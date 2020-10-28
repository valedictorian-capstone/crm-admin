import { Routes, RouterModule } from '@angular/router';
import { ProcessMainComponent } from './pages';

const routes: Routes = [
  { path: '', component: ProcessMainComponent },
];

export const ProcessRoutes = RouterModule.forChild(routes);
