import { Component, Input, OnInit } from '@angular/core';
import { CustomerVM } from '@view-models';

@Component({
  selector: 'app-dashboard-customer-in-month',
  templateUrl: './dashboard-customer-in-month.component.html',
  styleUrls: ['./dashboard-customer-in-month.component.scss']
})
export class DashboardCustomerInMonthComponent implements OnInit {
  @Input() set data(groups: { id: string, name: string, data: CustomerVM[] }[]) {
    this.groups = groups;
    this.customers = [];
    this.groups.forEach((group) => this.customers = this.customers.concat(group.data));
    this.useFilter();
  }
  customers: CustomerVM[] = [];
  groups: { id: string, name: string, data: CustomerVM[] }[] = [];
  filterCustomers: CustomerVM[] = [];
  search = {
    group: undefined,
    name: '',
  };
  constructor(
  ) { }

  ngOnInit() {
    this.useFilter();
  }
  useFilter = () => {
    this.filterCustomers = [];
    if (!this.search.group) {
      this.filterCustomers = this.customers.filter((customer) => customer.fullname.toLowerCase().includes(this.search.name.toLowerCase()));
    } else {
      this.filterCustomers = this.groups.find((e) => e.id === this.search.group.id).data
        .filter((customer) => customer.fullname.toLowerCase().includes(this.search.name.toLowerCase()));
    }
  }
}
