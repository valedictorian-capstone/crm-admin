import { NgModule } from '@angular/core';
import { ExtrasModule } from '@extras/extras.module';
import { DealRoutes } from './deal.routing';
import {
  DealActivityComponent,
  DealAttachmentComponent,
  DealNoteComponent,
  DealProductComponent,
  DealItemActivityComponent,
  DealItemComponent,
  DealLogComponent,
  DealSearchComponent
} from './components';
import {
  DealDetailPage,
  DealMainPage
} from './pages';
import {
  DealDetailContainer,
  DealMainContainer
} from './containers';
import { DealDynamicDirective } from './directives';
import { SizePipe } from './pipes';
const COMPONENTS = [
  DealActivityComponent,
  DealAttachmentComponent,
  DealNoteComponent,
  DealProductComponent,
  DealItemActivityComponent,
  DealItemComponent,
  DealSearchComponent,
  DealLogComponent
];
const CONTAINERS = [
  DealDetailContainer,
  DealMainContainer
];
const PAGES = [
  DealDetailPage,
  DealMainPage
];

const PIPES = [
  SizePipe,
];

const DIRECTIVES = [
  DealDynamicDirective
];

@NgModule({
  imports: [
    ExtrasModule.forChild(),
    DealRoutes
  ],
  declarations: [...PAGES, ...COMPONENTS, ...PIPES, ...DIRECTIVES, ...CONTAINERS],
})
export class DealModule {
}
