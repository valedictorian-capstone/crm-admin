import { NgModule } from '@angular/core';
import { ExtrasModule } from '@extras/extras.module';
import {
  TicketSearchComponent,
} from './components';
import { TicketMainPage } from './pages';
// import { } from './directives';
// import { } from './pipes';
import { TicketRoutes } from './ticket.routing';

import {
  TicketMainContainer,
  // TicketDetailContainer
} from './containers';
const CONTAINERS = [TicketMainContainer];
const COMPONENTS = [
  TicketSearchComponent
];

const PAGES = [
  TicketMainPage
];

const PIPES = [

];

const DIRECTIVES = [

];
@NgModule({
  imports: [
    ExtrasModule.forChild(),
    TicketRoutes
  ],
  declarations: [...PAGES, ...COMPONENTS, ...PIPES, ...DIRECTIVES, ...CONTAINERS]
})
export class TicketModule { }
