import { NgModule } from '@angular/core';
import { ExtrasModule } from '@extras/extras.module';
import {
  PipelineActionComponent,
  PipelineActivityComponent,
  PipelineDealComponent,
  PipelineStageComponent,
  PipelineRestoreComponent,
  PipelineSearchComponent
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
  PipelineStageComponent,
  PipelineActivityComponent,
  PipelineActionComponent,
  PipelineDealComponent,
  PipelineRestoreComponent,
  PipelineSearchComponent
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
