import { NgModule } from '@angular/core';
import { ExtrasModule } from '@extras/extras.module';
import { CallRoutes } from './call.routing';
import { CallMainPage } from './pages';

const PAGES = [
  CallMainPage
];
@NgModule({
  imports: [
    ExtrasModule.forChild(),
    CallRoutes
  ],
  declarations: [...PAGES]
})
export class CallModule { }
