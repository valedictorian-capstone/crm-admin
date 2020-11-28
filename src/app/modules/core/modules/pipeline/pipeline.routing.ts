import { Routes, RouterModule } from '@angular/router';
import {
  PipelineAddPage,
  PipelineDetailPage,
  PipelineEditPage,
  PipelineLoadingPage
} from './pages';

const routes: Routes = [
  { path: '', component: PipelineLoadingPage },
  { path: 'add', component: PipelineAddPage },
  { path: 'detail', component: PipelineDetailPage },
  { path: 'edit', component: PipelineEditPage },
];

export const PipelineRoutes = RouterModule.forChild(routes);
