import { NgModule } from '@angular/core';
import { ExtrasModule } from '@extras/extras.module';
import {
  ContactItemComponent,
  ContactSearchComponent

} from './components';
import { ContactMainPage } from './pages';
// import { } from './directives';
// import { } from './pipes';
import { ContactRoutes } from './contact.routing';
const COMPONENTS = [
  ContactItemComponent,
  ContactSearchComponent
];

const PAGES = [
  ContactMainPage
];

const PIPES = [

];

const DIRECTIVES = [

];
@NgModule({
  imports: [
    ExtrasModule.forChild(),
    ContactRoutes
  ],
  declarations: [...PAGES, ...COMPONENTS, ...PIPES, ...DIRECTIVES]
})
export class ContactModule { }
