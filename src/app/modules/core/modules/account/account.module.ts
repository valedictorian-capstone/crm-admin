import { NgModule } from '@angular/core';
import { ExtrasModule } from '@extras/extras.module';
import { ClipboardModule } from '@angular/cdk/clipboard';
import {
  AccountCreateComponent,
  AccountListComponent,
  AccountUpdateComponent,
  AccountMailComponent
} from './components';
import { AccountRoutes } from './account.routing';
import {
  AccountMainComponent
} from './pages';

const COMPONENTS = [
  AccountCreateComponent,
  AccountListComponent,
  AccountUpdateComponent,
  AccountMailComponent
];
const PAGES = [
  AccountMainComponent,
];
@NgModule({
  imports: [
    ExtrasModule.forRoot(),
    ClipboardModule,
    AccountRoutes,
  ],
  declarations: [...COMPONENTS, ...PAGES]
})
export class AccountModule { }
