import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AntModule, NebularModule, PrimeModule, NgxModule } from './modules';
import {
  CategorySelectComponent,
  CustomerSelectComponent,
  DealSelectComponent,
  EmployeeSelectComponent,
  EmployeeItemComponent,
  EmployeeFilterComponent,
  PipelineSelectComponent,
  ProductSelectComponent,
  DealItemComponent,
  TicketItemComponent,
  CustomerItemComponent,
  SelectDateComponent,
  SelectDateTimeComponent
} from './components';
import {
  ActivitySavePage,
  AttachmentSavePage,
  CustomerSavePage,
  DealSavePage,
  EmployeeSavePage,
  NoteSavePage,
  ProductSavePage,
  PipelineMovetoPage,
  CustomerImportPage,
  EmployeeImportPage,
  ImportDataPage,
  ProductImportPage,
  MailSenderPage,
  CustomerProfilePage,
  SettingPasswordPage,
  SettingProfilePage,
  SettingRolePage,
  EventSavePage,
} from './pages';
import { LengthPipe, ShortPipe, TimePipe, MoneyPipe, TotalMoneyPipe, MaskPipe, SeparatorPipe, KeyPipe } from './pipes';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ClipboardModule } from '@angular/cdk/clipboard';

export const EXTRA_MODULES = [
  AntModule,
  NebularModule,
  PrimeModule,
  NgxModule,

];

export const ANGULAR_MODULES = [
  FormsModule,
  ReactiveFormsModule,
  CommonModule,
  DragDropModule,
  ClipboardModule
];
export const REUSE_COMPONENTS = [
  CategorySelectComponent,
  CustomerSelectComponent,
  DealSelectComponent,
  EmployeeSelectComponent,
  EmployeeItemComponent,
  EmployeeFilterComponent,
  PipelineSelectComponent,
  ProductSelectComponent,
  DealItemComponent,
  TicketItemComponent,
  CustomerItemComponent,
  SelectDateComponent,
  SelectDateTimeComponent
];

export const REUSE_PAGES = [
  ActivitySavePage,
  AttachmentSavePage,
  CustomerSavePage,
  DealSavePage,
  EmployeeSavePage,
  NoteSavePage,
  ProductSavePage,
  PipelineMovetoPage,
  CustomerImportPage,
  EmployeeImportPage,
  ImportDataPage,
  ProductImportPage,
  MailSenderPage,
  CustomerProfilePage,
  SettingPasswordPage,
  SettingProfilePage,
  EventSavePage,
  SettingRolePage
];
export const PIPES = [
  LengthPipe,
  ShortPipe,
  TimePipe,
  MoneyPipe,
  TotalMoneyPipe,
  MaskPipe,
  SeparatorPipe,
  KeyPipe
];
@NgModule({
  imports: [
    ...ANGULAR_MODULES,
    ...EXTRA_MODULES,
  ],
  declarations: [
    ...REUSE_COMPONENTS,
    ...REUSE_PAGES,
    ...PIPES
  ],
  exports: [
    ...ANGULAR_MODULES,
    ...EXTRA_MODULES,
    ...REUSE_COMPONENTS,
    ...REUSE_PAGES,
    ...PIPES,
  ],
})
export class ExtrasModule {
  static forRoot(name: string = 'default'): ModuleWithProviders<ExtrasModule> {
    return {
      ngModule: ExtrasModule,
      providers: [
        ...NebularModule.forRoot().providers,
        ...NgxModule.forRoot().providers,
      ]
    };
  }
  static forChild(name: string = 'default'): ModuleWithProviders<ExtrasModule> {
    return {
      ngModule: ExtrasModule,
      providers: [
        ...NebularModule.forChild().providers,
        ...NgxModule.forChild().providers,
      ]
    };
  }
}
