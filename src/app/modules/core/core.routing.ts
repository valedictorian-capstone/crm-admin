import { Routes, RouterModule } from '@angular/router';
import { CoreGuard } from './core.guard';
import { LayoutPage } from './pages';

const routes: Routes = [
  {
    path: '', component: LayoutPage, children: [
      { path: '', redirectTo: 'process' },
      {
        path: 'customer',
        loadChildren: () => import('@app/modules/core/modules').then((m) => m.ContactModule),
        canLoad: [CoreGuard],
        data: { permission: 'Customer' }
      },
      {
        path: 'lead',
        loadChildren: () => import('@app/modules/core/modules').then((m) => m.LeadModule),
        canLoad: [CoreGuard],
        data: { permission: 'Customer' }
      },
      {
        path: 'account',
        loadChildren: () => import('@app/modules/core/modules').then((m) => m.EmployeeModule),
        canLoad: [CoreGuard],
        data: { permission: 'Employee' }
      },
      {
        path: 'process',
        loadChildren: () => import('@app/modules/core/modules').then((m) => m.PipelineModule),
        canLoad: [CoreGuard],
        data: { permission: 'Process' }
      },
      {
        path: 'deal',
        loadChildren: () => import('@app/modules/core/modules').then((m) => m.DealModule),
        canLoad: [CoreGuard],
        data: { permission: 'Deal' }
      },
      {
        path: 'product',
        loadChildren: () => import('@app/modules/core/modules').then((m) => m.ProductModule),
        canLoad: [CoreGuard],
        data: { permission: 'Product' }
      },
      {
        path: 'activity',
        loadChildren: () => import('@app/modules/core/modules').then((m) => m.ActivityModule),
        canLoad: [CoreGuard],
        data: { permission: 'Activity' }
      },
      {
        path: 'call',
        loadChildren: () => import('@app/modules/core/modules').then((m) => m.CallModule),
        canLoad: [CoreGuard],
        data: { permission: 'Call' }
      },
      { path: 'error', loadChildren: () => import('src/app/modules/core/modules').then((m) => m.ErrorModule) },
      { path: '**', redirectTo: 'error' }
    ]
  },
];

export const CoreRoutes = RouterModule.forChild(routes);
