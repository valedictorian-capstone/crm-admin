import { NgModule } from '@angular/core';
import { ExtrasModule } from '@extras/extras.module';
import {
  TicketItemComponent,
} from './components';
import { TicketMainPage } from './pages';
// import { } from './directives';
// import { } from './pipes';
import { TicketRoutes } from './ticket.routing';
const COMPONENTS = [
  TicketItemComponent
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
  declarations: [...PAGES, ...COMPONENTS, ...PIPES, ...DIRECTIVES]
})
export class TicketModule { }
