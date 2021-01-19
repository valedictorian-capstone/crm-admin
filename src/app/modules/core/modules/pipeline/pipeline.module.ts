import { NgModule } from '@angular/core';
import { ExtrasModule } from '@extras/extras.module';
import {
  PipelineMainContainer
} from './containers';
import { PipelineRoutes } from './pipeline.routing';
// import { } from './directives';
// import { MoneyPipe, TotalMoneyPipe } from './pipes';
const COMPONENTS = [

];
const CONTAINERS = [PipelineMainContainer];
const PAGES = [

];

const PIPES = [

];

const DIRECTIVES = [

];
@NgModule({
  imports: [
    ExtrasModule.forChild(),
    PipelineRoutes,
  ],
  declarations: [...PAGES, ...COMPONENTS, ...PIPES, ...DIRECTIVES, ...CONTAINERS]
})
export class PipelineModule { }
