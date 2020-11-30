import { NgModule } from '@angular/core';
import { ExtrasModule } from '@extras/extras.module';
import {
  EmployeeItemComponent,
} from './components';
import { EmployeeMainPage } from './pages';
// import { } from './directives';
// import { } from './pipes';
import { EmployeeRoutes } from './employee.routing';
const COMPONENTS = [
  EmployeeItemComponent,
];

const PAGES = [
  EmployeeMainPage
];

const PIPES = [

];

const DIRECTIVES = [

];
@NgModule({
  imports: [
    ExtrasModule.forChild(),
    EmployeeRoutes
  ],
  declarations: [...PAGES, ...COMPONENTS, ...PIPES, ...DIRECTIVES]
})
export class EmployeeModule { }
