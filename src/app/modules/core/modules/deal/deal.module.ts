import { NgModule } from '@angular/core';
import { ExtrasModule } from '@extras/extras.module';
import { DealRoutes } from './deal.routing';
import {
  DealDetailContainer,
  DealMainContainer
} from './containers';
// import {  } from './directives';
// import {  } from './pipes';
const CONTAINERS = [
  DealDetailContainer,
  DealMainContainer
];

const PIPES = [
];

const DIRECTIVES = [
];

@NgModule({
  imports: [
    ExtrasModule.forChild(),
    DealRoutes
  ],
  declarations: [...PIPES, ...DIRECTIVES, ...CONTAINERS],
})
export class DealModule {
}
