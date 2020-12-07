import { Routes, RouterModule } from '@angular/router';
import { CoreGuard } from './core.guard';
import { LayoutPage } from './pages';

const routes: Routes = [
  {
    path: '', component: LayoutPage, children: [
      { path: '', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadChildren: () => import('@app/modules/core/modules').then((m) => m.DashboardModule),
      },
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
        path: 'event',
        loadChildren: () => import('@app/modules/core/modules').then((m) => m.EventModule),
        canLoad: [CoreGuard],
        data: { permission: 'Event' }
      },
      {
        path: 'process',
        loadChildren: () => import('@app/modules/core/modules').then((m) => m.PipelineModule),
        canLoad: [CoreGuard],
        data: { permission: 'Deal' }
      },
      {
        path: 'ticket',
        loadChildren: () => import('@app/modules/core/modules').then((m) => m.TicketModule),
        canLoad: [CoreGuard],
        data: { permission: 'Ticket' }
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
        data: { permission: 'Deal' }
      },
      {
        path: 'setting',
        loadChildren: () => import('@app/modules/core/modules').then((m) => m.RoleModule),
        canLoad: [CoreGuard],
        data: { permission: 'Role' }
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
