import { NgModule } from '@angular/core';
import {
  AutoCompleteComponent,
  CheckBoxComponent,
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
  RadioComponent
} from './components';
import { ControlDirective } from './directives';
import { GroupComponent } from './pages';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AntModule } from '../ant/ant.module';
import { NebularModule } from '../nebular/nebular.module';
import { PrimeModule } from '../prime/prime.module';
import { CommonModule } from '@angular/common';


const COMPONENTS = [
  AutoCompleteComponent,
  CheckBoxComponent,
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
  RadioComponent
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
    FormsModule,
    ReactiveFormsModule,
    AntModule,
    PrimeModule,
    NebularModule.forChild(),
  ],
  declarations: [...COMPONENTS, ...DIRECTIVES, ...PAGES],
  exports: [...COMPONENTS, ...DIRECTIVES, ...PAGES],
})
export class FormModule { }
