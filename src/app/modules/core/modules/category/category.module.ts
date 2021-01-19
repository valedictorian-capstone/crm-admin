import { NgModule } from '@angular/core';
import { ExtrasModule } from '@extras/extras.module';

import {
  CategoryMainContainer,
} from './containers';
// import { } from './extras/directives';
// import { } from './extras/interfaces';
// import { } from './extras/models';
// import { } from './extras/pipes';
import { CategoryRoutes } from './category.routing';

const CONTAINERS = [CategoryMainContainer];
@NgModule({
  imports: [
    ExtrasModule.forChild(),
    CategoryRoutes
  ],
  declarations: [
    ...CONTAINERS,
  ]
})
export class CategoryModule { }
