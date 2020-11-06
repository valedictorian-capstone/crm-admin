import { Routes, RouterModule } from '@angular/router';
import { ConfigMainComponent } from './pages';
const routes: Routes = [
  { path: '', component: ConfigMainComponent },
];

export const ConfigRoutes = RouterModule.forChild(routes);
