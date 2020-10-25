import { NgModule } from '@angular/core';
import { ExtrasModule } from '@extras/extras.module';
import {
  InstanceCreateComponent,
  InstanceListComponent,
  InstanceUpdateComponent
} from './components';
import { InstanceRoutes } from './instance.routing';
import {
  InstanceMainComponent,
  InstanceDetailComponent
} from './pages';

const COMPONENTS = [
  InstanceCreateComponent,
  InstanceListComponent,
  InstanceUpdateComponent,
];
const PAGES = [
  InstanceMainComponent,
  InstanceDetailComponent
];
@NgModule({
  imports: [
    ExtrasModule.forRoot(),
    InstanceRoutes,
  ],
  declarations: [...COMPONENTS, ...PAGES]
})
export class InstanceModule { }
