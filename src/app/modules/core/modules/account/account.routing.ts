import { Routes, RouterModule } from '@angular/router';
import { AccountMainComponent, AccountDetailComponent } from './pages';

const routes: Routes = [
  { path: '', component: AccountMainComponent },
  { path: ':id', component: AccountDetailComponent },
];

export const AccountRoutes = RouterModule.forChild(routes);
