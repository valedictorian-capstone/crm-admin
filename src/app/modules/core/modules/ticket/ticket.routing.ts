import { Routes, RouterModule } from '@angular/router';
// import { TicketMainPage } from './pages';
import { TicketMainContainer } from './containers';

const routes: Routes = [
  { path: '', component: TicketMainContainer },
];

export const TicketRoutes = RouterModule.forChild(routes);
