import { ComponentFactoryResolver, Directive, ViewContainerRef, OnInit, ComponentRef, Input, Type } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormControlVM } from '@view-models';
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
} from '../../components';

@Directive({
  selector: '[appControl]'
})
export class ControlDirective implements OnInit {
  @Input() control: FormControl;
  @Input() group: FormGroup;
  @Input() item: FormControlVM;
  @Input() isDesign?: boolean;
  protected readonly components: Array<{ type: string, component: Type<any> }> = [
    {
      type: 'auto-complete',
      component: AutoCompleteComponent,
    },
    {
      type: 'check-box',
      component: CheckBoxComponent,
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
      type: 'radio',
      component: RadioComponent,
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
  protected componentRef: ComponentRef<any>;
  constructor(
    protected readonly factoryResolver: ComponentFactoryResolver,
    protected readonly containerRef: ViewContainerRef,
  ) { }

  ngOnInit() {
    const factory = this.factoryResolver.resolveComponentFactory(
      this.components.find((component) => component.type === this.item.type).component
    );
    this.componentRef = this.containerRef.createComponent(factory);
    this.componentRef.instance.control = this.control;
    this.componentRef.instance.group = this.group;
    this.componentRef.instance.item = this.item;
    this.componentRef.instance.isDesign = this.isDesign;
  }

}
