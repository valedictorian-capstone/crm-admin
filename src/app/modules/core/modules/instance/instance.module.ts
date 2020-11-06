import { NgModule } from '@angular/core';
import { ExtrasModule } from '@extras/extras.module';
import {
  InstanceDetailComponent,
  InstanceStepComponent
} from './components';
import { InstanceRoutes } from './instance.routing';
import {
  InstanceMainComponent,
} from './pages';

const COMPONENTS = [
  InstanceDetailComponent,
  InstanceStepComponent
];
const PAGES = [
  InstanceMainComponent,
];
@NgModule({
  imports: [
    ExtrasModule.forRoot(),
    InstanceRoutes,
  ],
  declarations: [...COMPONENTS, ...PAGES]
})
export class InstanceModule { }
