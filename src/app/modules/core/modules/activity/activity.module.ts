import { NgModule } from '@angular/core';
import { ExtrasModule } from '@extras/extras.module';
import { ActivityRoutes } from './activity.routing';
import { ActivityMainContainer } from './containers';
const COMPONENTS = [
];

const CONTAINERS = [
  ActivityMainContainer
];

const PIPES = [

];

const DIRECTIVES = [

];
@NgModule({
  imports: [
    ExtrasModule.forChild(),
    ActivityRoutes
  ],
  declarations: [...CONTAINERS, ...COMPONENTS, ...PIPES, ...DIRECTIVES]
})
export class ActivityModule { }
