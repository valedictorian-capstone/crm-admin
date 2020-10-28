import { NgModule } from '@angular/core';
import { ExtrasModule } from '@extras/extras.module';
import { ClipboardModule } from '@angular/cdk/clipboard';
import {
  ContactCreateComponent,
  ContactListComponent,
  ContactUpdateComponent,
  ContactMailComponent
} from './components';
import { ContactRoutes } from './contact.routing';
import {
  ContactMainComponent
} from './pages';

const COMPONENTS = [
  ContactCreateComponent,
  ContactListComponent,
  ContactUpdateComponent,
  ContactMailComponent
];
const PAGES = [
  ContactMainComponent,
];
@NgModule({
  imports: [
    ExtrasModule.forRoot(),
    ClipboardModule,
    ContactRoutes,
  ],
  declarations: [...COMPONENTS, ...PAGES]
})
export class ContactModule { }
