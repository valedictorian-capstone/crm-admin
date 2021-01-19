import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { ICustomerMainState } from '@extras/features/customer';
@Component({
  selector: 'app-customer-page-count',
  templateUrl: './customer-page-count.component.html',
  styleUrls: ['./customer-page-count.component.scss']
})
export class CustomerPageCountComponent {
  @Output() useSelectPageCount: EventEmitter<any> = new EventEmitter<any>();
  @Input() state: ICustomerMainState;
}
