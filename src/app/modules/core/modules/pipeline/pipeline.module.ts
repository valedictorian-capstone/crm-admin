import { NgModule } from '@angular/core';
import { ExtrasModule } from '@extras/extras.module';
import {
  PipelineActionComponent,
  PipelineActivityComponent,
  PipelineDealComponent,
  PipelineMovetoComponent,
  PipelineRunComponent,
  PipelineStageComponent,
  PipelineRestoreComponent,
} from './components';
import {
  PipelineAddPage,
  PipelineDetailPage,
  PipelineEditPage,
  PipelineLoadingPage
} from './pages';
import { PipelineRoutes } from './pipeline.routing';
// import { } from './directives';
// import { MoneyPipe, TotalMoneyPipe } from './pipes';
const COMPONENTS = [
  PipelineRunComponent,
  PipelineStageComponent,
  PipelineActivityComponent,
  PipelineActionComponent,
  PipelineDealComponent,
  PipelineMovetoComponent,
  PipelineRestoreComponent
];

const PAGES = [
  PipelineAddPage,
  PipelineDetailPage,
  PipelineEditPage,
  PipelineLoadingPage
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
  declarations: [...PAGES, ...COMPONENTS, ...PIPES, ...DIRECTIVES]
})
export class PipelineModule { }
