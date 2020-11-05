import { NgModule } from '@angular/core';
import { ExtrasModule } from '@extras/extras.module';
import {
  ServiceCreateComponent,
  ServiceListComponent,
  ServiceUpdateComponent
} from './components';
import { ServiceRoutes } from './service.routing';
import {
  ServiceMainComponent,
  ServiceDetailComponent
} from './pages';
import { NgxMaskModule, IConfig } from 'ngx-mask';
const options: Partial<IConfig> | (() => Partial<IConfig>) = null;

const COMPONENTS = [
  ServiceCreateComponent,
  ServiceListComponent,
  ServiceUpdateComponent,
];
const PAGES = [
  ServiceMainComponent,
  ServiceDetailComponent
];
@NgModule({
  imports: [
    ExtrasModule.forRoot(),
    ServiceRoutes,
    NgxMaskModule.forRoot(options),
  ],
  declarations: [...COMPONENTS, ...PAGES]
})
export class ServiceModule { }
