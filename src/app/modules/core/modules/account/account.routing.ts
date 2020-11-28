import { Routes, RouterModule } from '@angular/router';
import { AccountMainPage } from './pages';

const routes: Routes = [
  { path: '', component: AccountMainPage },
];

export const AccountRoutes = RouterModule.forChild(routes);
