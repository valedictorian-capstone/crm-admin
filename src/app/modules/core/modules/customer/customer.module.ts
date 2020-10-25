import { NgModule } from '@angular/core';
import { ExtrasModule } from '@extras/extras.module';
import {
  CustomerCreateComponent,
  CustomerListComponent,
  CustomerUpdateComponent
} from './components';
import { CustomerRoutes } from './customer.routing';
import {
  CustomerMainComponent,
  CustomerDetailComponent
} from './pages';

const COMPONENTS = [
  CustomerCreateComponent,
  CustomerListComponent,
  CustomerUpdateComponent,
];
const PAGES = [
  CustomerMainComponent,
  CustomerDetailComponent
];
@NgModule({
  imports: [
    ExtrasModule.forRoot(),
    CustomerRoutes,
  ],
  declarations: [...COMPONENTS, ...PAGES]
})
export class CustomerModule { }
