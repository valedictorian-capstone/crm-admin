import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgModule } from '@angular/core';
import { ExtrasModule } from '@extras/extras.module';
import {
  ActivityCalendarComponent,
  ActivityListComponent,
  ActivityListItemComponent,
  ActivitySearchComponent
} from './components';
import { ActivityMainPage } from './pages';
// import { } from './directives';
// import { } from './pipes';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { ActivityRoutes } from './activity.routing';
const COMPONENTS = [
  ActivityCalendarComponent,
  ActivityListComponent,
  ActivityListItemComponent,
  ActivitySearchComponent
];

const PAGES = [
  ActivityMainPage
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
    ActivityRoutes
  ],
  declarations: [...PAGES, ...COMPONENTS, ...PIPES, ...DIRECTIVES]
})
export class ActivityModule { }
