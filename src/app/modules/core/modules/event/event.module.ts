import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgModule } from '@angular/core';
import { ExtrasModule } from '@extras/extras.module';
// import {
// } from './components';
import { EventMainPage } from './pages';
// import { } from './directives';
// import { } from './pipes';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { EventRoutes } from './event.routing';
const COMPONENTS = [
];

const PAGES = [
  EventMainPage
];

const PIPES = [

];

const DIRECTIVES = [

];
@NgModule({
  imports: [
    ExtrasModule.forChild(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    EventRoutes
  ],
  declarations: [...PAGES, ...COMPONENTS, ...PIPES, ...DIRECTIVES]
})
export class EventModule { }
