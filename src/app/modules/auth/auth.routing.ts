import { Routes, RouterModule } from '@angular/router';
import { LoginComponent, NavigateComponent } from './components';

const routes: Routes = [
  { path: '', redirectTo: 'navigate' },
  { path: 'navigate', component: NavigateComponent },
  { path: 'login', component: LoginComponent },
];

export const AuthRoutes = RouterModule.forChild(routes);
