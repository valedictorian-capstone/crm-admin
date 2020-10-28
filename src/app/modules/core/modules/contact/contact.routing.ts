import { Routes, RouterModule } from '@angular/router';
import { ContactMainComponent } from './pages';

const routes: Routes = [
  { path: '', component: ContactMainComponent },
];

export const ContactRoutes = RouterModule.forChild(routes);
