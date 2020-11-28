import { Routes, RouterModule } from '@angular/router';
import { ContactMainPage } from './pages';

const routes: Routes = [
  { path: '', component: ContactMainPage },
];

export const ContactRoutes = RouterModule.forChild(routes);
