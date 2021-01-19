import { Routes, RouterModule } from '@angular/router';
import { PipelineMainContainer } from './containers';

const routes: Routes = [
  { path: '', component: PipelineMainContainer },
];

export const PipelineRoutes = RouterModule.forChild(routes);
