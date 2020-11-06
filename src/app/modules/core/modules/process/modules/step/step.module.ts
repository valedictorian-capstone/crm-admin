import { NgModule } from '@angular/core';
import { ExtrasModule } from '@extras/extras.module';
import { DragDropModule } from 'primeng/dragdrop';
import { StepRoutes } from './step.routing';
import {
  StepCreateComponent,
  StepListComponent,
  StepUpdateComponent
} from './components';
import { StepMainComponent } from './pages';

const COMPONENTS = [
  StepCreateComponent,
  StepListComponent,
  StepUpdateComponent
];
const PAGES = [
  StepMainComponent
];
@NgModule({
  imports: [
    ExtrasModule.forRoot(),
    DragDropModule,
    StepRoutes
  ],
  declarations: [...COMPONENTS, ...PAGES]
})
export class StepModule { }
