import { NgModule } from '@angular/core';
import { ExtrasModule } from '@extras/extras.module';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import {
  DashboardCustomerComponent,
  DashboardAccountComponent,
  DashboardFeedbackComponent,
  DashboardServiceComponent,
} from './components';
import { DashboardRoutes } from './dashboard.routing';
import {
  DashboardMainComponent,
} from './pages';
import * as echarts from 'echarts';
const COMPONENTS = [
  DashboardCustomerComponent,
  DashboardAccountComponent,
  DashboardFeedbackComponent,
  DashboardServiceComponent,
];
const PAGES = [
  DashboardMainComponent,
];
@NgModule({
  imports: [
    ExtrasModule.forRoot(),
    DashboardRoutes,
    NgxEchartsModule.forRoot({
      echarts
    }),
    NgxChartsModule,
  ],
  declarations: [...COMPONENTS, ...PAGES]
})
export class DashboardModule { }
