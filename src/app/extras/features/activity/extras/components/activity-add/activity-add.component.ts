import { Component, Input } from '@angular/core';
import { GlobalService } from '@services';
import { CampaignVM, DealVM } from '@view-models';

@Component({
  selector: 'app-activity-add',
  templateUrl: './activity-add.component.html',
  styleUrls: ['./activity-add.component.scss']
})
export class ActivityAddComponent {
  @Input() canAdd: boolean;
  @Input() isMain: boolean;
  @Input() for: string;
  @Input() campaign: CampaignVM;
  @Input() deal: DealVM;
  constructor(
    protected readonly globalService: GlobalService,
  ) { }

  useAdd() {
    this.globalService.triggerView$.next({ type: 'activity', payload: { for: this.campaign ? 'campaign' : (this.deal ? 'deal' : this.for), campaign: this.campaign, deal: this.deal, fix: !this.isMain } });
  }
}
