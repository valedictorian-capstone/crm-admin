import { NgModule } from '@angular/core';
import { ExtrasModule } from '@extras/extras.module';
import {
  RoleCreateComponent,
  RoleListComponent,
  RoleUpdateComponent
} from './components';
import { RoleRoutes } from './role.routing';
import {
  RoleMainComponent,
} from './pages';

const COMPONENTS = [
  RoleCreateComponent,
  RoleListComponent,
  RoleUpdateComponent,
];
const PAGES = [
  RoleMainComponent,
];
@NgModule({
  imports: [
    ExtrasModule.forRoot(),
    RoleRoutes,
  ],
  declarations: [...COMPONENTS, ...PAGES]
})
export class RoleModule { }
