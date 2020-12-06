import { NgModule } from '@angular/core';
import { ExtrasModule } from '@extras/extras.module';
import {
  DashboardCustomerInMonthComponent,
  DashboardDealInMonthComponent,
  DashboardDealInYearComponent,
  DashboardCustomerInYearComponent
} from './components';
import { DashboardMainPage } from './pages';
// import { } from './directives';
// import { } from './pipes';
import { DashboardRoutes } from './dashboard.routing';
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';
const COMPONENTS = [
  DashboardCustomerInMonthComponent,
  DashboardDealInMonthComponent,
  DashboardDealInYearComponent,
  DashboardCustomerInYearComponent
];

const PAGES = [
  DashboardMainPage
];

const PIPES = [

];

const DIRECTIVES = [

];
@NgModule({
  imports: [
    ExtrasModule.forChild(),
    NgxEchartsModule.forRoot({
      echarts
    }),
    DashboardRoutes,
  ],
  declarations: [...PAGES, ...COMPONENTS, ...PIPES, ...DIRECTIVES]
})
export class DashboardModule { }
