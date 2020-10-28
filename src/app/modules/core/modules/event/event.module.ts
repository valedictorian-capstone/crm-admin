import { NgModule } from '@angular/core';
import { ExtrasModule } from '@extras/extras.module';
import {
  EventCreateComponent,
  EventListComponent,
  EventUpdateComponent
} from './components';
import { EventRoutes } from './event.routing';
import {
  EventMainComponent,
} from './pages';

const COMPONENTS = [
  EventCreateComponent,
  EventListComponent,
  EventUpdateComponent,
];
const PAGES = [
  EventMainComponent,
];
@NgModule({
  imports: [
    ExtrasModule.forRoot(),
    EventRoutes,
  ],
  declarations: [...COMPONENTS, ...PAGES]
})
export class EventModule { }
