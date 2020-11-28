import { NgModule } from '@angular/core';
import { ExtrasModule } from '@extras/extras.module';
import {
  AddComponent,
  AddMenuComponent,
  BreadcrumbComponent,
  ContentComponent,
  NavComponent,
  NotificationComponent,
  SearchComponent,
  SearchResultComponent,
  UserComponent
} from './components';
import { CoreRoutes } from './core.routing';
import { LayoutPage } from './pages';
import { FullnameShortPipe } from './pipes';
const COMPONENTS = [
  NavComponent,
  ContentComponent,
  NotificationComponent,
  AddComponent,
  BreadcrumbComponent,
  SearchComponent,
  UserComponent,
  AddMenuComponent,
  SearchResultComponent
];

const PAGES = [
  LayoutPage,
];

const PIPES = [
  FullnameShortPipe
];

const DIRECTIVES = [

];
@NgModule({
  imports: [
    ExtrasModule.forChild(),
    CoreRoutes,
  ],
  declarations: [...PAGES, ...COMPONENTS, ...PIPES, ...DIRECTIVES]
})
export class CoreModule { }
