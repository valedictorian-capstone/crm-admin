import { NgModule } from '@angular/core';
import { ExtrasModule } from '@extras/extras.module';
import { InstanceRoutes } from './instance.routing';
import {
  InstanceCreateComponent,
  InstanceListComponent,
} from './components';
import { InstanceMainComponent } from './pages';

const COMPONENTS = [
  InstanceCreateComponent,
  InstanceListComponent,
];
const PAGES = [
  InstanceMainComponent
];
@NgModule({
  imports: [
    ExtrasModule.forRoot(),
    InstanceRoutes
  ],
  declarations: [...COMPONENTS, ...PAGES]
})
export class InstanceModule { }
