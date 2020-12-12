import { NgModule } from '@angular/core';
import { ExtrasModule } from '@extras/extras.module';
import {
  LeadItemComponent,
  LeadSearchComponent
} from './components';
import { LeadMainPage } from './pages';
// import { } from './directives';
// import { } from './pipes';
import { LeadRoutes } from './lead.routing';
const COMPONENTS = [
  LeadItemComponent,
  LeadSearchComponent
];

const PAGES = [
  LeadMainPage
];

const PIPES = [

];

const DIRECTIVES = [

];
@NgModule({
  imports: [
    ExtrasModule.forChild(),
    LeadRoutes,
  ],
  declarations: [...PAGES, ...COMPONENTS, ...PIPES, ...DIRECTIVES]
})
export class LeadModule { }
