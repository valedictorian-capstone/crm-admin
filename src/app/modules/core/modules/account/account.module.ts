import { NgModule } from '@angular/core';
import { ExtrasModule } from '@extras/extras.module';
import {
  AccountCreateComponent,
  AccountListComponent,
  AccountUpdateComponent
} from './components';
import { AccountRoutes } from './account.routing';
import {
  AccountMainComponent,
  AccountDetailComponent,
} from './pages';

const COMPONENTS = [
  AccountCreateComponent,
  AccountListComponent,
  AccountUpdateComponent,
];
const PAGES = [
  AccountMainComponent,
  AccountDetailComponent
];
@NgModule({
  imports: [
    ExtrasModule.forRoot(),
    AccountRoutes,
  ],
  declarations: [...COMPONENTS, ...PAGES]
})
export class AccountModule { }
