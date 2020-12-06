import { Routes, RouterModule } from '@angular/router';
import { EventMainPage } from './pages';

const routes: Routes = [
  { path: '', component: EventMainPage },
];

export const EventRoutes = RouterModule.forChild(routes);
