import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './pages';
const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard' },
      { path: 'account', loadChildren: () => import('src/app/modules/core/modules').then((m) => m.AccountModule) },
      { path: 'contact', loadChildren: () => import('src/app/modules/core/modules').then((m) => m.ContactModule) },
      // { path: 'customer', loadChildren: () => import('src/app/modules/core/modules').then((m) => m.CustomerModule) },
      { path: 'dashboard', loadChildren: () => import('src/app/modules/core/modules').then((m) => m.DashboardModule) },
      { path: 'department', loadChildren: () => import('src/app/modules/core/modules').then((m) => m.DepartmentModule) },
      { path: 'employee', loadChildren: () => import('src/app/modules/core/modules').then((m) => m.EmployeeModule) },
      { path: 'event', loadChildren: () => import('src/app/modules/core/modules').then((m) => m.EventModule) },
      { path: 'form', loadChildren: () => import('src/app/modules/core/modules').then((m) => m.FormModule) },
      { path: 'group', loadChildren: () => import('src/app/modules/core/modules').then((m) => m.GroupModule) },
      { path: 'service', loadChildren: () => import('src/app/modules/core/modules').then((m) => m.ServiceModule) },
      { path: 'instance', loadChildren: () => import('src/app/modules/core/modules').then((m) => m.InstanceModule) },
      { path: 'lead', loadChildren: () => import('src/app/modules/core/modules').then((m) => m.LeadModule) },
      { path: 'opportunity', loadChildren: () => import('src/app/modules/core/modules').then((m) => m.OpportunityModule) },
      { path: 'process', loadChildren: () => import('src/app/modules/core/modules').then((m) => m.ProcessModule) },
      { path: 'role', loadChildren: () => import('src/app/modules/core/modules').then((m) => m.RoleModule) },
      { path: 'strategy', loadChildren: () => import('src/app/modules/core/modules').then((m) => m.StrategyModule) },
      { path: '404', loadChildren: () => import('src/app/modules/core/modules').then((m) => m.ErrorModule) },
      { path: '**', redirectTo: '404' }
    ],
  },
];

export const CoreRoutes = RouterModule.forChild(routes);
