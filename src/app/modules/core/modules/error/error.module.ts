import { NgModule } from '@angular/core';
import { ExtrasModule } from '@extras/extras.module';
import {
  NotFoundComponent
} from './components';
import { ErrorRoutes } from './error.routing';
import {
  ErrorMainPage,
} from './pages';

const COMPONENTS = [
  NotFoundComponent
];
const PAGES = [
  ErrorMainPage,
];
@NgModule({
  imports: [
    ExtrasModule.forRoot(),
    ErrorRoutes,
  ],
  declarations: [...COMPONENTS, ...PAGES]
})
export class ErrorModule { }
