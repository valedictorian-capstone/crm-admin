import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AntModule, NebularModule, PrimeModule, NgxModule } from './modules';
import {
  CategorySelectComponent,
  CustomerSelectComponent,
  EmployeeSelectComponent,
  EmployeeItemComponent,
  EmployeeFilterComponent,
  PipelineSelectComponent,
  ProductSelectComponent,
  DealItemComponent,
  TicketItemComponent,
  CustomerItemComponent,
  CustomerImportItemComponent,
  SelectDateComponent,
  SelectDateTimeComponent,
} from './components';
import {
  CustomerSavePage,
  EmployeeSavePage,
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
import {
  SupportPaginationComponent,
  SupportPageCountComponent,
  SupportDateComponent,
  SupportDateTimeComponent,
  SupportMailModal,
  SupportPasswordModal,
  SupportProfileModal
} from './features/support';
import {
  ActivityAddComponent,
  ActivityCalendarArea,
  ActivityCalendarItemComponent,
  ActivityCardArea,
  ActivityCardItemComponent,
  ActivityDatatableArea,
  ActivityDatatableItemComponent,
  ActivityExportComponent,
  ActivityMainContainer,
  ActivityQueryComponent,
  ActivityTypeComponent,
  ActivitySaveModal,
  ActivitySolveCheckComponent,
} from './features/activity';
import {
  TicketCardArea,
  TicketCardItemComponent,
  TicketDatatableArea,
  TicketDatatableItemComponent,
  TicketExportComponent,
  TicketMainContainer,
  TicketQueryComponent,
  TicketTypeComponent,
  TicketSaveModal,
  TicketSolveCheckComponent,
} from './features/ticket';
import {
  RoleCardArea,
  RoleCardItemComponent,
  RoleDatatableArea,
  RoleDatatableItemComponent,
  RoleExportComponent,
  RoleMainContainer,
  RoleQueryComponent,
  RoleTypeComponent,
  RoleSaveModal,
  RoleSolveCheckComponent,
  RoleAddComponent,
  RoleEmployeeComponent,
  RoleSelectComponent
} from './features/role';
import {
  DealAddComponent,
  DealKanbanArea,
  DealKanbanItemComponent,
  DealCardArea,
  DealCardItemComponent,
  DealDatatableArea,
  DealDatatableItemComponent,
  DealExportComponent,
  DealMainContainer,
  DealQueryComponent,
  DealTypeComponent,
  DealProcessComponent,
  DealSaveModal,
  DealSelect1Component,
  DealKanbanSubItemComponent,
  DealSolveCheckComponent
} from './features/deal';
import {
  NoteAddComponent,
  NoteCardArea,
  NoteCardItemComponent,
  NoteDatatableArea,
  NoteDatatableItemComponent,
  NoteExportComponent,
  NoteMainContainer,
  NoteQueryComponent,
  NoteSaveModal,
  NoteSolveCheckComponent
} from './features/note';
import {
  LogCardArea,
  LogCardItemComponent,
  LogDatatableArea,
  LogDatatableItemComponent,
  LogExportComponent,
  LogMainContainer,
  LogTypeComponent,
  LogSolveCheckComponent,} from './features/log';
import {
  CampaignAddComponent,
  CampaignCardArea,
  CampaignCardItemComponent,
  CampaignDatatableArea,
  CampaignDatatableItemComponent,
  CampaignExportComponent,
  CampaignMainContainer,
  CampaignQueryComponent,
  CampaignTypeComponent,
  CampaignSaveModal,
  CampaignSelect1Component,
  CampaignSolveCheckComponent,
  CampaignInformationComponent
} from './features/campaign';
import {
  PipelineAddComponent,
  PipelineCardArea,
  PipelineCardItemComponent,
  PipelineDatatableArea,
  PipelineDatatableItemComponent,
  PipelineExportComponent,
  PipelineMainContainer,
  PipelineQueryComponent,
  PipelineTypeComponent,
  PipelineSaveModal,
  PipelineSelect1Component,
  PipelineSolveCheckComponent
} from './features/pipeline';
import {
  AttachmentAddComponent,
  AttachmentCardArea,
  AttachmentCardItemComponent,
  AttachmentDatatableArea,
  AttachmentDatatableItemComponent,
  AttachmentExportComponent,
  AttachmentMainContainer,
  AttachmentQueryComponent,
  AttachmentTypeComponent,
  AttachmentSaveModal,
  SizePipe,
  AttachmentSolveCheckComponent
} from './features/attachment';
import {
  CustomerAddComponent,
  CustomerCardArea,
  CustomerCardItemComponent,
  CustomerDatatableArea,
  CustomerDatatableItemComponent,
  CustomerExportComponent,
  CustomerMainContainer,
  CustomerQueryComponent,
  CustomerTypeComponent,
  CustomerSaveModal,
  CustomerImportComponent,
  CustomerSelect1Component,
  CustomerSolveCheckComponent,
} from './features/customer';
import {
  ProductAddComponent,
  ProductCardArea,
  ProductCardItemComponent,
  ProductDatatableArea,
  ProductDatatableItemComponent,
  ProductExportComponent,
  ProductMainContainer,
  ProductQueryComponent,
  ProductTypeComponent,
  ProductSaveModal,
  ProductImportComponent,
  ProductSelect1Component,
  ProductSolveCheckComponent,
  ProductCategoryComponent
} from './features/product';
import {
  CategoryAddComponent,
  CategoryCardArea,
  CategoryCardItemComponent,
  CategoryDatatableArea,
  CategoryDatatableItemComponent,
  CategoryExportComponent,
  CategoryMainContainer,
  CategoryQueryComponent,
  CategoryTypeComponent,
  CategorySaveModal,
  CategorySelect1Component,
  CategorySolveCheckComponent,
  CategoryProductComponent
} from './features/category';
import {
  EmployeeAddComponent,
  EmployeeCardArea,
  EmployeeCardItemComponent,
  EmployeeDatatableArea,
  EmployeeDatatableItemComponent,
  EmployeeExportComponent,
  EmployeeMainContainer,
  EmployeeQueryComponent,
  EmployeeTypeComponent,
  EmployeeSaveModal,
  EmployeeSelect1Component,
  EmployeeSolveCheckComponent,
  EmployeeRoleComponent
} from './features/employee';
import { LengthPipe, ShortPipe, TimePipe, MoneyPipe, TotalMoneyPipe, MaskPipe, SeparatorPipe, KeyPipe } from './pipes';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarModule, DateAdapter } from 'angular-calendar';
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
export const FEATURES = [
  ProductAddComponent,
  ProductCardArea,
  ProductCardItemComponent,
  ProductDatatableArea,
  ProductDatatableItemComponent,
  ProductExportComponent,
  ProductMainContainer,
  ProductQueryComponent,
  ProductTypeComponent,
  ProductSaveModal,
  ProductImportComponent,
  ProductSelect1Component,
  ProductSolveCheckComponent,
  ProductCategoryComponent,

  CategoryAddComponent,
  CategoryCardArea,
  CategoryCardItemComponent,
  CategoryDatatableArea,
  CategoryDatatableItemComponent,
  CategoryExportComponent,
  CategoryMainContainer,
  CategoryQueryComponent,
  CategoryTypeComponent,
  CategorySaveModal,
  CategorySelect1Component,
  CategorySolveCheckComponent,
  CategoryProductComponent,

  RoleCardArea,
  RoleCardItemComponent,
  RoleDatatableArea,
  RoleDatatableItemComponent,
  RoleExportComponent,
  RoleMainContainer,
  RoleQueryComponent,
  RoleTypeComponent,
  RoleSaveModal,
  RoleSolveCheckComponent,
  RoleAddComponent,
  RoleEmployeeComponent,
  RoleSelectComponent,

  EmployeeAddComponent,
  EmployeeCardArea,
  EmployeeCardItemComponent,
  EmployeeDatatableArea,
  EmployeeDatatableItemComponent,
  EmployeeExportComponent,
  EmployeeMainContainer,
  EmployeeQueryComponent,
  EmployeeTypeComponent,
  EmployeeSaveModal,
  EmployeeSelect1Component,
  EmployeeSolveCheckComponent,
  EmployeeRoleComponent,

  CustomerAddComponent,
  CustomerCardArea,
  CustomerCardItemComponent,
  CustomerDatatableArea,
  CustomerDatatableItemComponent,
  CustomerExportComponent,
  CustomerMainContainer,
  CustomerQueryComponent,
  CustomerTypeComponent,
  CustomerSaveModal,
  CustomerImportComponent,
  CustomerSelect1Component,
  CustomerSolveCheckComponent,

  LogCardArea,
  LogCardItemComponent,
  LogDatatableArea,
  LogDatatableItemComponent,
  LogExportComponent,
  LogMainContainer,
  LogTypeComponent,
  LogSolveCheckComponent,

  NoteAddComponent,
  NoteCardArea,
  NoteCardItemComponent,
  NoteDatatableArea,
  NoteDatatableItemComponent,
  NoteExportComponent,
  NoteMainContainer,
  NoteQueryComponent,
  NoteSaveModal,
  NoteSolveCheckComponent,

  CampaignAddComponent,
  CampaignCardArea,
  CampaignCardItemComponent,
  CampaignDatatableArea,
  CampaignDatatableItemComponent,
  CampaignExportComponent,
  CampaignMainContainer,
  CampaignQueryComponent,
  CampaignTypeComponent,
  CampaignSaveModal,
  CampaignSelect1Component,
  CampaignSolveCheckComponent,
  CampaignInformationComponent,

  ActivityAddComponent,
  ActivityCalendarArea,
  ActivityCalendarItemComponent,
  ActivityCardArea,
  ActivityCardItemComponent,
  ActivityDatatableArea,
  ActivityDatatableItemComponent,
  ActivityExportComponent,
  ActivityMainContainer,
  ActivityQueryComponent,
  ActivityTypeComponent,
  ActivitySaveModal,
  ActivitySolveCheckComponent,

  DealAddComponent,
  DealKanbanArea,
  DealKanbanItemComponent,
  DealCardArea,
  DealCardItemComponent,
  DealDatatableArea,
  DealDatatableItemComponent,
  DealExportComponent,
  DealMainContainer,
  DealProcessComponent,
  DealQueryComponent,
  DealTypeComponent,
  DealKanbanSubItemComponent,
  DealSaveModal,
  DealSelect1Component,
  DealSolveCheckComponent,

  AttachmentAddComponent,
  AttachmentCardArea,
  AttachmentCardItemComponent,
  AttachmentDatatableArea,
  AttachmentDatatableItemComponent,
  AttachmentExportComponent,
  AttachmentMainContainer,
  AttachmentQueryComponent,
  AttachmentTypeComponent,
  AttachmentSolveCheckComponent,
  AttachmentSaveModal,
  SizePipe,

  PipelineAddComponent,
  PipelineCardArea,
  PipelineCardItemComponent,
  PipelineDatatableArea,
  PipelineDatatableItemComponent,
  PipelineExportComponent,
  PipelineMainContainer,
  PipelineQueryComponent,
  PipelineTypeComponent,
  PipelineSaveModal,
  PipelineSelect1Component,
  PipelineSolveCheckComponent,

  TicketCardArea,
  TicketCardItemComponent,
  TicketDatatableArea,
  TicketDatatableItemComponent,
  TicketExportComponent,
  TicketMainContainer,
  TicketQueryComponent,
  TicketTypeComponent,
  TicketSaveModal,
  TicketSolveCheckComponent,

  SupportPaginationComponent,
  SupportPageCountComponent,
  SupportDateComponent,
  SupportDateTimeComponent,
  SupportMailModal,
  SupportPasswordModal,
  SupportProfileModal
];
export const REUSE_COMPONENTS = [
  CategorySelectComponent,
  CustomerSelectComponent,
  EmployeeSelectComponent,
  EmployeeItemComponent,
  EmployeeFilterComponent,
  PipelineSelectComponent,
  ProductSelectComponent,
  DealItemComponent,
  TicketItemComponent,
  CustomerItemComponent,
  CustomerImportItemComponent,
  SelectDateComponent,
  SelectDateTimeComponent,
];

export const REUSE_PAGES = [
  CustomerSavePage,
  EmployeeSavePage,
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
  SettingRolePage,
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
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  declarations: [
    ...REUSE_COMPONENTS,
    ...REUSE_PAGES,
    ...FEATURES,
    ...PIPES
  ],
  exports: [
    ...ANGULAR_MODULES,
    ...EXTRA_MODULES,
    ...FEATURES,
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
