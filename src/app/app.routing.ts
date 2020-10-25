import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('src/app/modules').then((m) => m.AuthModule),
  },
  {
    path: 'core',
    loadChildren: () => import('src/app/modules').then((m) => m.CoreModule),
    canLoad: []
  },
];

export const AppRoutes = RouterModule.forRoot(routes, { useHash: true });
