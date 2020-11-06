import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgModule } from '@angular/core';
import { ExtrasModule } from '@extras/extras.module';
import { ProcessRoutes } from './process.routing';
import {
  ProcessMainComponent,
} from './pages';

const PAGES = [
  ProcessMainComponent,
];
@NgModule({
  imports: [
    ExtrasModule.forRoot(),
    ProcessRoutes,
    DragDropModule
  ],
  declarations: [...PAGES]
})
export class ProcessModule { }
