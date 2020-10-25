import { Routes, RouterModule } from '@angular/router';
import { GroupMainComponent, GroupDetailComponent } from './pages';

const routes: Routes = [
  { path: '', component: GroupMainComponent },
  { path: ':id', component: GroupDetailComponent },
];

export const GroupRoutes = RouterModule.forChild(routes);
