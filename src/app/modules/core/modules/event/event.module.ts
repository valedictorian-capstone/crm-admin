import { NgModule } from '@angular/core';
import { ExtrasModule } from '@extras/extras.module';
import { EventRoutes } from './event.routing';

@NgModule({
  imports: [
    ExtrasModule.forChild(),
    EventRoutes,
  ],
  declarations: []
})
export class EventModule { }
