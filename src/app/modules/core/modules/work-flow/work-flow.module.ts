import { NgModule } from '@angular/core';
import { ExtrasModule } from '@extras/extras.module';
import {
  WorkFlowCreateComponent,
  WorkFlowListComponent,
  WorkFlowUpdateComponent
} from './components';
import {
  WorkFlowDetailComponent, WorkFlowMainComponent
} from './pages';
import { WorkFlowRoutes } from './work-flow.routing';

const COMPONENTS = [
  WorkFlowCreateComponent,
  WorkFlowListComponent,
  WorkFlowUpdateComponent,
];
const PAGES = [
  WorkFlowMainComponent,
  WorkFlowDetailComponent
];
@NgModule({
  imports: [
    ExtrasModule.forRoot(),
    WorkFlowRoutes,
  ],
  declarations: [...COMPONENTS, ...PAGES]
})
export class WorkFlowModule { }
