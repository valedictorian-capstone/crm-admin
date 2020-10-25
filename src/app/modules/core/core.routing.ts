import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './pages';
const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard' },
      { path: 'dashboard', loadChildren: () => import('src/app/modules/core/modules').then((m) => m.DashboardModule) },
      { path: 'account', loadChildren: () => import('src/app/modules/core/modules').then((m) => m.AccountModule) },
      { path: 'customer', loadChildren: () => import('src/app/modules/core/modules').then((m) => m.CustomerModule) },
      { path: 'form', loadChildren: () => import('src/app/modules/core/modules').then((m) => m.FormModule) },
      { path: 'group', loadChildren: () => import('src/app/modules/core/modules').then((m) => m.GroupModule) },
      { path: 'department', loadChildren: () => import('src/app/modules/core/modules').then((m) => m.DepartmentModule) },
      { path: 'product', loadChildren: () => import('src/app/modules/core/modules').then((m) => m.ProductModule) },
      { path: 'work-flow', loadChildren: () => import('src/app/modules/core/modules').then((m) => m.WorkFlowModule) },
      { path: 'instance', loadChildren: () => import('src/app/modules/core/modules').then((m) => m.InstanceModule) },
    ],
  },
];

export const CoreRoutes = RouterModule.forChild(routes);
