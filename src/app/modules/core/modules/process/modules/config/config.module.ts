import { NgModule } from '@angular/core';
import { ExtrasModule } from '@extras/extras.module';
import { ConfigRoutes } from './config.routing';
import {
  ConfigCreateComponent,
  ConfigListComponent,
  ConfigUpdateComponent
} from './components';
import { ConfigMainComponent } from './pages';

const COMPONENTS = [
  ConfigCreateComponent,
  ConfigListComponent,
  ConfigUpdateComponent
];
const PAGES = [
  ConfigMainComponent
];
@NgModule({
  imports: [
    ExtrasModule.forRoot(),
    ConfigRoutes
  ],
  declarations: [...COMPONENTS, ...PAGES]
})
export class ConfigModule { }
