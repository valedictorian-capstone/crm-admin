import { Routes, RouterModule } from '@angular/router';
import { TicketMainPage } from './pages';

const routes: Routes = [
  { path: '**', component: TicketMainPage },
];

export const TicketRoutes = RouterModule.forChild(routes);
