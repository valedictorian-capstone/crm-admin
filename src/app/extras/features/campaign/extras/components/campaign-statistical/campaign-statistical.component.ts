import { Component, OnInit, Input } from '@angular/core';
import { CampaignService } from '@services';
import { CampaignVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-campaign-statistical',
  templateUrl: './campaign-statistical.component.html',
  styleUrls: ['./campaign-statistical.component.scss']
})
export class CampaignStatisticalComponent {
  @Input() campaign: CampaignVM;
  total;
  totalValue = () => 0;
  totalGroupValues;
  showTotal = true;
  showTotalValue = true;
  showTotalGroupsValues = true;
  constructor(
    protected readonly service: CampaignService,
    protected readonly spinner: NgxSpinnerService,
  ) {

  }
  ngOnInit() {
    console.log('statistical');
    this.service.statistical(this.campaign.id)
      .pipe(
        tap((data) => {
          console.log(data);
          this.totalValue = () => data.totalValue;
          this.totalGroupValues = {
            tooltip: {
              trigger: 'axis',
              axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: [
              {
                type: 'category',
                data: data.totalGroupValues.map((e) => e.name),
                axisTick: {
                  alignWithLabel: true
                }
              }
            ],
            yAxis: [
              {
                type: 'value'
              }
            ],
            series: [
              {
                name: 'Group',
                type: 'bar',
                barWidth: '60%',
                data: data.totalGroupValues.map((e) => e.value)
              }
            ]
          }
          this.total = {
            tooltip: {
              trigger: 'item'
            },
            legend: {
              orient: 'vertical',
              left: 'left',
            },
            series: [
              {
                name: 'Deal',
                type: 'pie',
                radius: '50%',
                data: [
                  { value: data.total[0].length, name: 'Processing' },
                  { value: data.total[1].length, name: 'Won' },
                  { value: data.total[2].length, name: 'Lost' },
                  { value: data.total[3].length, name: 'Expired' },
                ],
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ],
            color: ['#17a2b8', '#28a745', '#dc3545', '#dc3545'],
          };
          console.log('total:', this.total)
        })
      )
      .subscribe();
  }
}
