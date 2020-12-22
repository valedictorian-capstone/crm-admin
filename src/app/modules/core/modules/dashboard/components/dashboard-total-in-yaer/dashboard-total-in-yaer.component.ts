import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-total-in-yaer',
  templateUrl: './dashboard-total-in-yaer.component.html',
  styleUrls: ['./dashboard-total-in-yaer.component.scss']
})
export class DashboardTotalInYaerComponent implements OnInit {
  @Input() set data(res: number[]) {
    this.useSettingYearChart(res);

  }
  option;

  constructor(
  ) { }

  ngOnInit() {
  }

  useSettingYearChart = (res: number[]) => {
    this.option = {
      title: {
        text: 'Total value in the year',
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
        {
          type: 'bar',
          data: res,
          showBackground: true,
        },
        {
          name: 'Sum',
          type: 'line',
          data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num) => res[num]),
        }
      ],
      color: ['#007bff', '#ffc107'],
    };
  }

}
