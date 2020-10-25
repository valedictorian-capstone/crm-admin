import { Routes, RouterModule } from '@angular/router';
import { FormMainComponent, FormDetailComponent } from './pages';

const routes: Routes = [
  { path: '', component: FormMainComponent },
  { path: ':id', component: FormDetailComponent },
];

export const FormRoutes = RouterModule.forChild(routes);
