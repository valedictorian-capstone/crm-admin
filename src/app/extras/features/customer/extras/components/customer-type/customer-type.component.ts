import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-customer-type',
  templateUrl: './customer-type.component.html',
  styleUrls: ['./customer-type.component.scss']
})
export class CustomerTypeComponent {
  @Input() type: 'datatable' | 'card';
  @Output() typeChange: EventEmitter<'datatable' | 'card'> = new EventEmitter<'datatable' | 'card'>();
}
