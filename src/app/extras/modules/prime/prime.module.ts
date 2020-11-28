import { NgModule } from '@angular/core';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { AccordionModule } from 'primeng/accordion';
import { SharedModule } from 'primeng/api';
import { BlockUIModule } from 'primeng/blockui';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CaptchaModule } from 'primeng/captcha';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { ChartModule } from 'primeng/chart';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipsModule } from 'primeng/chips';
import { CodeHighlighterModule } from 'primeng/codehighlighter';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DataViewModule } from 'primeng/dataview';
import { DeferModule } from 'primeng/defer';
import { DialogModule } from 'primeng/dialog';
import { DragDropModule } from 'primeng/dragdrop';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { EditorModule } from 'primeng/editor';
import { FieldsetModule } from 'primeng/fieldset';
import { FileUploadModule } from 'primeng/fileupload';
import { FocusTrapModule } from 'primeng/focustrap';
import { FullCalendarModule } from 'primeng/fullcalendar';
import { GalleriaModule } from 'primeng/galleria';
import { GMapModule } from 'primeng/gmap';
import { InplaceModule } from 'primeng/inplace';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { KeyFilterModule } from 'primeng/keyfilter';
import { LightboxModule } from 'primeng/lightbox';
import { ListboxModule } from 'primeng/listbox';
import { MegaMenuModule } from 'primeng/megamenu';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { MessageModule } from 'primeng/message';
import { MultiSelectModule } from 'primeng/multiselect';
import { OrderListModule } from 'primeng/orderlist';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PaginatorModule } from 'primeng/paginator';
import { PanelModule } from 'primeng/panel';
import { PanelMenuModule } from 'primeng/panelmenu';
import { PasswordModule } from 'primeng/password';
import { PickListModule } from 'primeng/picklist';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SidebarModule } from 'primeng/sidebar';
import { SlideMenuModule } from 'primeng/slidemenu';
import { SliderModule } from 'primeng/slider';
import { SpinnerModule } from 'primeng/spinner';
import { SplitButtonModule } from 'primeng/splitbutton';
import { StepsModule } from 'primeng/steps';
import { TableModule } from 'primeng/table';
import { TabMenuModule } from 'primeng/tabmenu';
import { TabViewModule } from 'primeng/tabview';
import { TerminalModule } from 'primeng/terminal';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { TreeModule } from 'primeng/tree';
import { TreeTableModule } from 'primeng/treetable';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';
import { VirtualScrollerModule } from 'primeng/virtualscroller';
import {CalendarModule} from 'primeng/calendar';
const PRIME_MODULES = [
  AutoCompleteModule,
AccordionModule,
SharedModule,
BlockUIModule,
BreadcrumbModule,
ButtonModule,
CaptchaModule,
CardModule,
CarouselModule,
ChartModule,
CheckboxModule,
ChipsModule,
CodeHighlighterModule,
ColorPickerModule,
ConfirmDialogModule,
ContextMenuModule,
DataViewModule,
DeferModule,
DialogModule,
DragDropModule,
DropdownModule,
DynamicDialogModule,
EditorModule,
FieldsetModule,
FileUploadModule,
FocusTrapModule,
FullCalendarModule,
GalleriaModule,
GMapModule,
InplaceModule,
InputMaskModule,
InputNumberModule,
InputSwitchModule,
InputTextModule,
InputTextareaModule,
KeyFilterModule,
LightboxModule,
ListboxModule,
  MegaMenuModule,
  CalendarModule,
MenuModule,
MenubarModule,
MessageModule,
MultiSelectModule,
OrderListModule,
OrganizationChartModule,
OverlayPanelModule,
PaginatorModule,
PanelModule,
PanelMenuModule,
PasswordModule,
PickListModule,
ProgressBarModule,
ProgressSpinnerModule,
RadioButtonModule,
RatingModule,
RippleModule,
ScrollPanelModule,
SelectButtonModule,
SidebarModule,
SlideMenuModule,
SliderModule,
SpinnerModule,
SplitButtonModule,
StepsModule,
TableModule,
TabMenuModule,
TabViewModule,
TerminalModule,
TieredMenuModule,
ToastModule,
ToggleButtonModule,
ToolbarModule,
TooltipModule,
TreeModule,
TreeTableModule,
TriStateCheckboxModule,
VirtualScrollerModule,
];
@NgModule({
  exports: [...PRIME_MODULES]
})
export class PrimeModule { }
