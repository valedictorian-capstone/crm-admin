import { NgModule } from '@angular/core';
import { ExtrasModule } from '@extras/extras.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {
  FormCreateComponent,
  FormListComponent,
  FormUpdateComponent
} from './components';
import { NgxSmoothDnDModule } from 'ngx-smooth-dnd';
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
    NgxSmoothDnDModule,
    DragDropModule
  ],
  declarations: [...COMPONENTS, ...PAGES]
})
export class FormModule { }
