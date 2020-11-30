import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AntModule, NebularModule, PrimeModule, NgxModule } from './modules';
import {
  ActivityTimeComponent,
  CategorySelectComponent,
  CustomerSelectComponent,
  CustomerBirthdayComponent,
  DealSelectComponent,
  EmployeeSelectComponent,
  PipelineSelectComponent,
  ProductSelectComponent,
  RoleSelectComponent,
  CustomerColumnComponent,
  DealItemComponent,
  FeedbackItemComponent,
  TicketItemComponent,
  EmployeeItemComponent
} from './components';
import {
  ActivitySavePage,
  AttachmentSavePage,
  CustomerSavePage,
  DealSavePage,
  EmployeeSavePage,
  NoteSavePage,
  ProductSavePage,
  RoleSavePage,
  PipelineMovetoPage,
  CustomerImportPage,
  DealImportPage,
  EmployeeImportPage,
  ImportDataPage,
  ProductImportPage,
  MailSenderPage,
  CustomerProfilePage,
  SettingPasswordPage,
  SettingPermissionPage,
  SettingProfilePage,
  EventSavePage
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
  ActivityTimeComponent,
  CategorySelectComponent,
  CustomerSelectComponent,
  CustomerBirthdayComponent,
  DealSelectComponent,
  EmployeeSelectComponent,
  PipelineSelectComponent,
  ProductSelectComponent,
  RoleSelectComponent,
  CustomerColumnComponent,
  DealItemComponent,
  FeedbackItemComponent,
  TicketItemComponent,
  EmployeeItemComponent
];

export const REUSE_PAGES = [
  ActivitySavePage,
  AttachmentSavePage,
  CustomerSavePage,
  DealSavePage,
  EmployeeSavePage,
  NoteSavePage,
  ProductSavePage,
  RoleSavePage,
  PipelineMovetoPage,
  CustomerImportPage,
  DealImportPage,
  EmployeeImportPage,
  ImportDataPage,
  ProductImportPage,
  MailSenderPage,
  CustomerProfilePage,
  SettingPasswordPage,
  SettingPermissionPage,
  SettingProfilePage,
  EventSavePage
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
