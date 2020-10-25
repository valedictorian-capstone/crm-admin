import { NgModule } from '@angular/core';
import { ExtrasModule } from '@extras/extras.module';
import {
  FormCreateComponent,
  FormListComponent,
  FormUpdateComponent
} from './components';
import { FormRoutes } from './form.routing';
import {
  FormMainComponent,
  FormDetailComponent
} from './pages';

const COMPONENTS = [
  FormCreateComponent,
  FormListComponent,
  FormUpdateComponent,
];
const PAGES = [
  FormMainComponent,
  FormDetailComponent
];
@NgModule({
  imports: [
    ExtrasModule.forRoot(),
    FormRoutes,
  ],
  declarations: [...COMPONENTS, ...PAGES]
})
export class FormModule { }
