import { NgModule } from '@angular/core';
import { ExtrasModule } from '@extras/extras.module';
import {
  RoleAccountComponent,
  RolePermissionComponent,
} from './components';
import { RoleMainPage } from './pages';
// import { } from './directives';
// import { } from './pipes';
import { RoleRoutes } from './role.routing';
const COMPONENTS = [
  RoleAccountComponent,
  RolePermissionComponent,
];

const PAGES = [
  RoleMainPage
];

const PIPES = [

];

const DIRECTIVES = [

];
@NgModule({
  imports: [
    ExtrasModule.forChild(),
    RoleRoutes
  ],
  declarations: [...PAGES, ...COMPONENTS, ...PIPES, ...DIRECTIVES]
})
export class RoleModule { }
