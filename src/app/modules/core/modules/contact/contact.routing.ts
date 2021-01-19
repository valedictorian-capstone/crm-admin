import { Routes, RouterModule } from '@angular/router';
import { ContactMainContainer, ContactImportContainer } from './containers';

const routes: Routes = [
  { path: '', component: ContactMainContainer },
  { path: 'import', component: ContactImportContainer },
];

export const ContactRoutes = RouterModule.forChild(routes);
