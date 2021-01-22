import { NgModule } from '@angular/core';
import { ExtrasModule } from '@extras/extras.module';
import {
  EmployeeMainContainer
} from './containers';
import { EmployeeRoutes } from './employee.routing';
// import { } from './directives';
// import { MoneyPipe, TotalMoneyPipe } from './pipes';
const COMPONENTS = [

];
const CONTAINERS = [EmployeeMainContainer];
const PAGES = [

];

const PIPES = [

];

const DIRECTIVES = [

];
@NgModule({
  imports: [
    ExtrasModule.forChild(),
    EmployeeRoutes,
  ],
  declarations: [...PAGES, ...COMPONENTS, ...PIPES, ...DIRECTIVES, ...CONTAINERS]
})
export class EmployeeModule { }
