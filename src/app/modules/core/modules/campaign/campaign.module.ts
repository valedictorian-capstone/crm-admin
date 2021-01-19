import { NgModule } from '@angular/core';
import { ExtrasModule } from '@extras/extras.module';
import {
  CampaignMainContainer,
  CampaignDetailContainer
} from './containers';
// import { } from './extras/directives';
// import { } from './extras/interfaces';
// import { } from './extras/models';
// import { } from './extras/pipes';
import { CampaignRoutes } from './campaign.routing';

const CONTAINERS = [CampaignMainContainer, CampaignDetailContainer];
const EXTRA_DIRECTIVES = [];
const EXTRA_PIPES = [];
const EXTRA_MENUS = [];
@NgModule({
  imports: [
    ExtrasModule.forChild(),
    CampaignRoutes
  ],
  declarations: [
    ...CONTAINERS,
    ...EXTRA_DIRECTIVES,
    ...EXTRA_PIPES,
    ...EXTRA_MENUS,
  ]
})
export class CampaignModule { }
