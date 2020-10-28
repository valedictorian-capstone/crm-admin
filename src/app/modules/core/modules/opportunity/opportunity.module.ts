import { NgModule } from '@angular/core';
import { ExtrasModule } from '@extras/extras.module';
import { ClipboardModule } from '@angular/cdk/clipboard';
import {
  OpportunityCreateComponent,
  OpportunityListComponent,
  OpportunityUpdateComponent,
  OpportunityMailComponent
} from './components';
import { OpportunityRoutes } from './opportunity.routing';
import {
  OpportunityMainComponent
} from './pages';

const COMPONENTS = [
  OpportunityCreateComponent,
  OpportunityListComponent,
  OpportunityUpdateComponent,
  OpportunityMailComponent
];
const PAGES = [
  OpportunityMainComponent,
];
@NgModule({
  imports: [
    ExtrasModule.forRoot(),
    ClipboardModule,
    OpportunityRoutes,
  ],
  declarations: [...COMPONENTS, ...PAGES]
})
export class OpportunityModule { }
