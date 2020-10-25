import { ComponentFactoryResolver, Directive, ViewContainerRef, OnInit, ComponentRef, Input, Type } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormControlVM } from '@view-models';
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
} from '../../components';

@Directive({
  selector: '[appControl]'
})
export class ControlDirective implements OnInit {
  @Input() group: FormGroup;
  @Input() control: FormControlVM;
  protected readonly components: Array<{ type: string, component: Type<unknown> }> = [
    {
      type: 'auto-complete',
      component: AutoCompleteComponent,
    },
    {
      type: 'check-box',
      component: CheckBoxComponent,
    },
    {
      type: 'check-box-group',
      component: CheckBoxGroupComponent,
    },
    {
      type: 'date-picker',
      component: DatePickerComponent,
    },
    {
      type: 'date-range',
      component: DateRangeComponent,
    },
    {
      type: 'file-upload',
      component: FileUploadComponent,
    },
    {
      type: 'header',
      component: HeaderComponent,
    },
    {
      type: 'input',
      component: InputComponent,
    },
    {
      type: 'multi-select',
      component: MultiSelectComponent,
    },
    {
      type: 'label',
      component: LabelComponent,
    },
    {
      type: 'paragraph',
      component: ParagraphComponent,
    },
    {
      type: 'rate',
      component: RateComponent,
    },
    {
      type: 'select',
      component: SelectComponent,
    },
    {
      type: 'slider',
      component: SliderComponent,
    },
    {
      type: 'switch',
      component: SwitchComponent,
    },
    {
      type: 'text-area',
      component: TextAreaComponent,
    },
    {
      type: 'time-picker',
      component: TimePickerComponent,
    },
  ];
  protected componentRef: ComponentRef<unknown>;
  constructor(
    protected readonly factoryResolver: ComponentFactoryResolver,
    protected readonly containerRef: ViewContainerRef,
  ) { }

  ngOnInit() {
    const factory = this.factoryResolver.resolveComponentFactory(
      this.components.find((component) => component.type === this.control.type).component
    );
    this.componentRef = this.containerRef.createComponent(factory);
  }

}
