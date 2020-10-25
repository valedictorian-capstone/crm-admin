import { NgModule } from '@angular/core';
import { ExtrasModule } from '@extras/extras.module';
import {
  GroupCreateComponent,
  GroupListComponent,
  GroupUpdateComponent
} from './components';
import { GroupRoutes } from './group.routing';
import {
  GroupMainComponent,
  GroupDetailComponent
} from './pages';

const COMPONENTS = [
  GroupCreateComponent,
  GroupListComponent,
  GroupUpdateComponent,
];
const PAGES = [
  GroupMainComponent,
  GroupDetailComponent
];
@NgModule({
  imports: [
    ExtrasModule.forRoot(),
    GroupRoutes,
  ],
  declarations: [...COMPONENTS, ...PAGES]
})
export class GroupModule { }
