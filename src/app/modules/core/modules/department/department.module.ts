import { NgModule } from '@angular/core';
import { ExtrasModule } from '@extras/extras.module';
import {
  DepartmentCreateComponent,
  DepartmentListComponent,
  DepartmentUpdateComponent
} from './components';
import { DepartmentRoutes } from './department.routing';
import {
  DepartmentMainComponent,
  DepartmentDetailComponent
} from './pages';

const COMPONENTS = [
  DepartmentCreateComponent,
  DepartmentListComponent,
  DepartmentUpdateComponent,
];
const PAGES = [
  DepartmentMainComponent,
  DepartmentDetailComponent
];
@NgModule({
  imports: [
    ExtrasModule.forRoot(),
    DepartmentRoutes,
  ],
  declarations: [...COMPONENTS, ...PAGES]
})
export class DepartmentModule { }
