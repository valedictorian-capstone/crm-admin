import { NgModule } from '@angular/core';
import { ExtrasModule } from '@extras/extras.module';

import {
  ContactMainContainer,
  ContactImportContainer
} from './containers';
// import { } from './extras/directives';
// import { } from './extras/interfaces';
// import { } from './extras/models';
// import { } from './extras/pipes';
import { ContactRoutes } from './contact.routing';

const CONTAINERS = [ContactMainContainer, ContactImportContainer];
@NgModule({
  imports: [
    ExtrasModule.forChild(),
    ContactRoutes
  ],
  declarations: [
    ...CONTAINERS,
  ]
})
export class ContactModule { }
