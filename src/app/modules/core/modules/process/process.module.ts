import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgModule } from '@angular/core';
import { ExtrasModule } from '@extras/extras.module';
import {
  ProcessCreateComponent,
  ProcessListComponent,
  ProcessUpdateComponent,
  ProcessStepCreateComponent,
  ProcessStepUpdateComponent,
  ProcessStepListComponent,
} from './components';
import { ProcessRoutes } from './process.routing';
import {
  ProcessMainComponent,
  ProcessDetailComponent,
} from './pages';

const COMPONENTS = [
  ProcessCreateComponent,
  ProcessListComponent,
  ProcessUpdateComponent,
  ProcessStepCreateComponent,
  ProcessStepUpdateComponent,
  ProcessStepListComponent,
];
const PAGES = [
  ProcessMainComponent,
  ProcessDetailComponent
];
@NgModule({
  imports: [
    ExtrasModule.forRoot(),
    ProcessRoutes,
    DragDropModule
  ],
  declarations: [...COMPONENTS, ...PAGES]
})
export class ProcessModule { }
