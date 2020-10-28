import { NgModule } from '@angular/core';
import { ExtrasModule } from '@extras/extras.module';
import { ClipboardModule } from '@angular/cdk/clipboard';
import {
  LeadCreateComponent,
  LeadListComponent,
  LeadUpdateComponent,
  LeadMailComponent
} from './components';
import { LeadRoutes } from './lead.routing';
import {
  LeadMainComponent
} from './pages';

const COMPONENTS = [
  LeadCreateComponent,
  LeadListComponent,
  LeadUpdateComponent,
  LeadMailComponent
];
const PAGES = [
  LeadMainComponent,
];
@NgModule({
  imports: [
    ExtrasModule.forRoot(),
    ClipboardModule,
    LeadRoutes,
  ],
  declarations: [...COMPONENTS, ...PAGES]
})
export class LeadModule { }
