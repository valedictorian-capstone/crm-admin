import { NgModule } from '@angular/core';
import { ExtrasModule } from '@extras/extras.module';
import {
  StrategyCreateComponent,
  StrategyListComponent,
  StrategyUpdateComponent
} from './components';
import { StrategyRoutes } from './strategy.routing';
import {
  StrategyMainComponent,
} from './pages';

const COMPONENTS = [
  StrategyCreateComponent,
  StrategyListComponent,
  StrategyUpdateComponent,
];
const PAGES = [
  StrategyMainComponent,
];
@NgModule({
  imports: [
    ExtrasModule.forRoot(),
    StrategyRoutes,
  ],
  declarations: [...COMPONENTS, ...PAGES]
})
export class StrategyModule { }
