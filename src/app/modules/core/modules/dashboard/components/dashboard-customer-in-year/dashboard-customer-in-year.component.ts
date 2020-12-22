import { Component, Input, OnInit } from '@angular/core';
import { CustomerVM } from '@view-models';

@Component({
  selector: 'app-dashboard-customer-in-year',
  templateUrl: './dashboard-customer-in-year.component.html',
  styleUrls: ['./dashboard-customer-in-year.component.scss']
})
export class DashboardCustomerInYearComponent implements OnInit {
  @Input() set data(groups: { id: string, name: string, data: Array<CustomerVM[]> }[]) {
    this.useSettingYearChart(groups);

  }
  option;

  constructor(
  ) { }

  ngOnInit() {
  }

  useSettingYearChart = (groups: { id: string, name: string, data: Array<CustomerVM[]> }[]) => {
    this.option = {
      title: {
        text: 'Customers in the year',
        left: 'center',
        textStyle: {
          fontFamily: 'monospace, sans-serif'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: groups.map((e) => e.name),
        bottom: '-5px'
      },
      xAxis: [
        {
          type: 'category',
          data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        ...groups.map((group) => ({
          type: 'bar',
          name: group.name,
          data: group.data.map((e) => e.length),
          showBackground: true,
        })),
        {
          name: 'Sum',
          type: 'line',
          data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num) => groups.reduce((total, group) => total + group.data[num].length, 0)),
        }
      ],
      color: ['#007bff', '#28a745', '#dc3545', '#17a2b8', '#ffc107'],
    };
  }
}
