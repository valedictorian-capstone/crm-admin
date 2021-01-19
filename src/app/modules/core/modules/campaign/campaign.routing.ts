import { Routes, RouterModule } from '@angular/router';
import { CampaignMainContainer, CampaignDetailContainer } from './containers';

const routes: Routes = [
  { path: '', component: CampaignMainContainer },
  { path: ':id', component: CampaignDetailContainer },
];

export const CampaignRoutes = RouterModule.forChild(routes);
