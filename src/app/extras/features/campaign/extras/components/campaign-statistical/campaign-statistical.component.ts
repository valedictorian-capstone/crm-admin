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
  totalValue = 0;
  totalGroupValues = [];
  showTotal = true;
  showTotalValue = true;
  showTotalGroupsValues = true;
  constructor(
    protected readonly service: CampaignService,
    protected readonly spinner: NgxSpinnerService,
  ) {

  }
  ngOnInit() {
    this.service.statistical(this.campaign.id)
      .pipe(
        tap((data) => {
          console.log(data);
          this.totalValue = data.totalValue;
          this.totalGroupValues = data.totalGroupValues;
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
                  { value: data.total[0], name: 'processing' },
                  { value: data.total[1], name: 'won' },
                  { value: data.total[2], name: 'lost' },
                  { value: data.total[3], name: 'other' },
                ],
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          };
        })
      )
      .subscribe();
  }
}
