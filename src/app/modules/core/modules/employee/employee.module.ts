import { NgModule } from '@angular/core';
import { ExtrasModule } from '@extras/extras.module';
import {
  EmployeeCreateComponent,
  EmployeeListComponent,
  EmployeeUpdateComponent
} from './components';
import { EmployeeRoutes } from './employee.routing';
import {
  EmployeeMainComponent,
} from './pages';

const COMPONENTS = [
  EmployeeCreateComponent,
  EmployeeListComponent,
  EmployeeUpdateComponent,
];
const PAGES = [
  EmployeeMainComponent,
];
@NgModule({
  imports: [
    ExtrasModule.forRoot(),
    EmployeeRoutes,
  ],
  declarations: [...COMPONENTS, ...PAGES]
})
export class EmployeeModule { }
