import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AutoCompleteComponent,
  CheckBoxComponent,
  CheckBoxGroupComponent,
  DatePickerComponent,
  DateRangeComponent,
  FileUploadComponent,
  HeaderComponent,
  InputComponent,
  LabelComponent,
  MultiSelectComponent,
  ParagraphComponent,
  RateComponent,
  SelectComponent,
  SliderComponent,
  SwitchComponent,
  TextAreaComponent,
  TimePickerComponent,
} from './components';
import { ControlDirective } from './directives';
import { GroupComponent } from './pages';
const COMPONENTS = [
  AutoCompleteComponent,
  CheckBoxComponent,
  CheckBoxGroupComponent,
  DatePickerComponent,
  DateRangeComponent,
  FileUploadComponent,
  HeaderComponent,
  InputComponent,
  LabelComponent,
  MultiSelectComponent,
  ParagraphComponent,
  RateComponent,
  SelectComponent,
  SliderComponent,
  SwitchComponent,
  TextAreaComponent,
  TimePickerComponent,
];

const DIRECTIVES = [
  ControlDirective,
];

const PAGES = [
  GroupComponent,
];

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [...COMPONENTS, ...DIRECTIVES, ...PAGES],
  exports: [...COMPONENTS, ...DIRECTIVES, ...PAGES],
})
export class FormModule { }
