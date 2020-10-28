import { Routes, RouterModule } from '@angular/router';
import { OpportunityMainComponent } from './pages';

const routes: Routes = [
  { path: '', component: OpportunityMainComponent },
];

export const OpportunityRoutes = RouterModule.forChild(routes);
