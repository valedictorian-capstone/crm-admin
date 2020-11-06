import { Routes, RouterModule } from '@angular/router';
import { ProcessMainComponent } from './pages';

const routes: Routes = [
  {
    path: '', component: ProcessMainComponent, children: [
      {
        path: '',
        loadChildren: () => import('./modules').then((m) => m.ConfigModule)
      },
      {
        path: ':id',
        redirectTo: '',
      },
      {
        path: ':id/step',
        loadChildren: () => import('./modules').then((m) => m.StepModule)
      },
      {
        path: ':id/instance',
        loadChildren: () => import('./modules').then((m) => m.InstanceModule)
      }
    ]
  },
];

export const ProcessRoutes = RouterModule.forChild(routes);
