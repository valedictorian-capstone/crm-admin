import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CustomerService } from '@services';
import { CustomerVM } from '@view-models';

@Component({
  selector: 'app-reuse-customer-select',
  templateUrl: './customer-select.component.html',
  styleUrls: ['./customer-select.component.scss']
})
export class CustomerSelectComponent implements OnInit {
  @Output() useSelect: EventEmitter<CustomerVM> = new EventEmitter<CustomerVM>();
  @Output() useAdd: EventEmitter<string> = new EventEmitter<string>();
  @Input() template: HTMLElement;
  @Input() selected: CustomerVM;
  value = '';
  customers: CustomerVM[] = [];
  filterCustomers: CustomerVM[] = [];
  stage = 'finding';
  constructor(
    protected readonly customerService: CustomerService,
  ) { }
  ngOnInit() {
    this.customerService.findAll().subscribe((data) => {
      this.customers = data;
      setTimeout(() => {
        this.stage = 'done';
        this.filterCustomers = data;
      }, 500);
    });
  }
  useChangeValue = (value: string) => {
    this.stage = 'finding';
    setTimeout(() => {
      this.value = value;
      this.filterCustomers = this.customers.filter((customer) => customer.fullname.toLowerCase().includes(value.toLowerCase()));
      this.stage = 'done';
    }, 500);

  }
}
