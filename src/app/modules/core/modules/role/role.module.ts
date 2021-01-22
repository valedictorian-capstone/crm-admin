import { NgModule } from '@angular/core';
import { ExtrasModule } from '@extras/extras.module';
import {
  RoleMainContainer
} from './containers';
import { RoleRoutes } from './role.routing';
// import { } from './directives';
// import { MoneyPipe, TotalMoneyPipe } from './pipes';
const COMPONENTS = [

];
const CONTAINERS = [RoleMainContainer];
const PAGES = [

];

const PIPES = [

];

const DIRECTIVES = [

];
@NgModule({
  imports: [
    ExtrasModule.forChild(),
    RoleRoutes,
  ],
  declarations: [...PAGES, ...COMPONENTS, ...PIPES, ...DIRECTIVES, ...CONTAINERS]
})
export class RoleModule { }
