import { NbDateFnsDateModule } from '@nebular/date-fns';
import { NgModule } from '@angular/core';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { ExtrasModule } from '@extras/extras.module';
import { NbDatepickerModule } from '@nebular/theme';
import { NgxEmojiPickerModule } from 'ngx-emoji-picker';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import {
  InstanceDetailComponent,
  InstanceStepComponent,
  InstanceTaskCreateComponent,
  InstanceTaskUpdateComponent,
  InstanceCustomerCardComponent
} from './components';
import { InstanceRoutes } from './instance.routing';
import { vi } from 'date-fns/locale';
import {
  InstanceMainComponent
} from './pages';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import * as echarts from 'echarts';
const options: Partial<IConfig> | (() => Partial<IConfig>) = null;
const COMPONENTS = [
  InstanceDetailComponent,
  InstanceStepComponent,
  InstanceTaskCreateComponent,
  InstanceTaskUpdateComponent,
  InstanceCustomerCardComponent
];
const PAGES = [
  InstanceMainComponent,
];
@NgModule({
  imports: [
    ExtrasModule.forRoot(),
    InstanceRoutes,
    NgxEmojiPickerModule,
    PickerModule,
    NbDatepickerModule,
    NgxMaskModule.forRoot(options),
    NbDateFnsDateModule.forRoot(
      {
        parseOptions: { locale: vi, awareOfUnicodeTokens: true },
        formatOptions: { locale: vi, awareOfUnicodeTokens: true }
      }),
    NgxEchartsModule.forRoot({
      echarts
    }),
    NgxChartsModule,
  ],
  declarations: [...COMPONENTS, ...PAGES]
})
export class InstanceModule { }
