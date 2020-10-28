import { Routes, RouterModule } from '@angular/router';
import { AccountMainComponent } from './pages';

const routes: Routes = [
  { path: '', component: AccountMainComponent },
];

export const AccountRoutes = RouterModule.forChild(routes);
