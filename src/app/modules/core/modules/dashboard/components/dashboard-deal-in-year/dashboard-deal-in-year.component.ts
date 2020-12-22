import { Component, Input, OnInit } from '@angular/core';
import { DealVM } from '@view-models';

@Component({
  selector: 'app-dashboard-deal-in-year',
  templateUrl: './dashboard-deal-in-year.component.html',
  styleUrls: ['./dashboard-deal-in-year.component.scss']
})
export class DashboardDealInYearComponent implements OnInit {
  @Input() set data(groups: { status: string, data: Array<DealVM[]> }[]) {
    this.useSettingYearChart(groups);

  }
  option;

  constructor(
  ) { }

  ngOnInit() {
  }

  useSettingYearChart = (groups: { status: string, data: Array<DealVM[]> }[]) => {
    this.option = {
      title: {
        text: 'Deals in the year',
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
        data: groups.map((e) => e.status),
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
          name: group.status,
          data: group.data.map((e) => e.length),
          showBackground: true,
        })),
        {
          name: 'Sum',
          type: 'line',
          data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num) => groups.reduce((total, group) => total + group.data[num].length, 0)),
        }
      ],
      color: ['#007bff', '#28a745', '#dc3545', '#17a2b8'],
    };
  }
}
