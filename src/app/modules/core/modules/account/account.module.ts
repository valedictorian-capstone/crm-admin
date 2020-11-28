import { NgModule } from '@angular/core';
import { ExtrasModule } from '@extras/extras.module';
import {
  AccountItemComponent,
} from './components';
import { AccountMainPage } from './pages';
// import { } from './directives';
// import { } from './pipes';
import { AccountRoutes } from './account.routing';
const COMPONENTS = [
  AccountItemComponent,
];

const PAGES = [
  AccountMainPage
];

const PIPES = [

];

const DIRECTIVES = [

];
@NgModule({
  imports: [
    ExtrasModule.forChild(),
    AccountRoutes
  ],
  declarations: [...PAGES, ...COMPONENTS, ...PIPES, ...DIRECTIVES]
})
export class AccountModule { }
