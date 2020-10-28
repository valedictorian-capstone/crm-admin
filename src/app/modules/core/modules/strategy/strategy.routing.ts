import { Routes, RouterModule } from '@angular/router';
import { StrategyMainComponent } from './pages';

const routes: Routes = [
  { path: '', component: StrategyMainComponent },
];

export const StrategyRoutes = RouterModule.forChild(routes);
