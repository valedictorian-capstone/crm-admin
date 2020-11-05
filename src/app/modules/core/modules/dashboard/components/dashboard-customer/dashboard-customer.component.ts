import { DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CustomerService, GroupService } from '@services';
import { CustomerVM, GroupVM } from '@view-models';

@Component({
  selector: 'app-dashboard-customer',
  templateUrl: './dashboard-customer.component.html',
  styleUrls: ['./dashboard-customer.component.scss'],
  providers: [DecimalPipe],
})
export class DashboardCustomerComponent implements OnInit {
  customers: CustomerVM[] = [];
  groups: GroupVM[] = [];
  type: any;
  group: any;
  constructor(
    protected readonly decimalPipe: DecimalPipe,
    protected readonly service: CustomerService,
    protected readonly groupService: GroupService,
  ) { }

  ngOnInit() {
    this.service.findAll().subscribe((data) => {
      this.customers = data;
      const leads = this.customers.filter((customer) => customer.type === 'lead');
      const opportunities = this.customers.filter((customer) => customer.type === 'opportunity');
      const accounts = this.customers.filter((customer) => customer.type === 'account');
      const contacts = this.customers.filter((customer) => customer.type === 'contact');
      setTimeout(() => {
        this.type = this.loadPie(
          ['Lead', 'Opportunity', 'Account', 'Contact'],
          [
            {
              name: 'Lead',
              value: leads.length,
            },
            {
              name: 'Opportunity',
              value: opportunities.length,
            },
            {
              name: 'Account',
              value: accounts.length,
            },
            {
              name: 'Contact',
              value: contacts.length,
            },
          ]
        );
      }, 1000);
    });
    this.groupService.findAll().subscribe((data) => {
      this.groups = data;
      setTimeout(() => {
        this.group = this.loadPie(
          this.groups.map((e) => e.name),
          this.groups.map((e) => ({ name: e.name, value: e.customers.length })),
        );
      }, 1000);
    });
  }

  loadPie = (legendData: string[], seriesData: { name: string, value: number }[]) => {
    return {
      title: {
        x: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: (params) => {
          params.value = this.decimalPipe.transform(params.value, '1.0-0').split(',').join('.');
          return (
            params.seriesName + ' - ' + params.name + ' : ' + params.value + ' customers (' + params.percent + '%)'
          );
        },
      },
      legend: {
        x: 'center',
        y: 'bottom',
        data: legendData,
      },
      calculable: true,
      series: [
        {
          name: 'Ratio',
          selectedMode: 'single',
          type: 'pie',
          radius: 100,
          data: seriesData,
        },
      ],
    };
  }
}
