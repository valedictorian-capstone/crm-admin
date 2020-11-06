import { Routes, RouterModule } from '@angular/router';
import { StepMainComponent } from './pages';
const routes: Routes = [
  { path: '', component: StepMainComponent },
];

export const StepRoutes = RouterModule.forChild(routes);
