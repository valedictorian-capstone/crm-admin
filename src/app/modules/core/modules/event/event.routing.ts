import { Routes, RouterModule } from '@angular/router';
import { EventMainComponent } from './pages';

const routes: Routes = [
  { path: '', component: EventMainComponent },
];

export const EventRoutes = RouterModule.forChild(routes);
