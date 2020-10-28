import { NgModule } from '@angular/core';
import { ExtrasModule } from '@extras/extras.module';
import {
  ProcessCreateComponent,
  ProcessListComponent,
  ProcessUpdateComponent
} from './components';
import { ProcessRoutes } from './process.routing';
import {
  ProcessMainComponent,
} from './pages';

const COMPONENTS = [
  ProcessCreateComponent,
  ProcessListComponent,
  ProcessUpdateComponent,
];
const PAGES = [
  ProcessMainComponent,
];
@NgModule({
  imports: [
    ExtrasModule.forRoot(),
    ProcessRoutes,
  ],
  declarations: [...COMPONENTS, ...PAGES]
})
export class ProcessModule { }
