import { NgModule } from '@angular/core';
import { ExtrasModule } from '@extras/extras.module';
// import {
// } from './components';
import { DashboardRoutes } from './dashboard.routing';
import {
  DashboardMainComponent,
} from './pages';

const COMPONENTS = [

];
const PAGES = [
  DashboardMainComponent,
];
@NgModule({
  imports: [
    ExtrasModule.forRoot(),
    DashboardRoutes,
  ],
  declarations: [...COMPONENTS, ...PAGES]
})
export class DashboardModule { }
