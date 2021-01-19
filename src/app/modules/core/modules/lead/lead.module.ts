import { NgModule } from '@angular/core';
import { ExtrasModule } from '@extras/extras.module';
import { LeadMainContainer } from './containers';
// import { } from './extras/directives';
// import { } from './extras/interfaces';
// import { } from './extras/models';
// import { } from './extras/pipes';
import { LeadRoutes } from './lead.routing';



const CONTAINERS = [LeadMainContainer];

@NgModule({
  imports: [
    ExtrasModule.forChild(),
    LeadRoutes
  ],
  declarations: [
    ...CONTAINERS,
  ]
})
export class LeadModule { }
