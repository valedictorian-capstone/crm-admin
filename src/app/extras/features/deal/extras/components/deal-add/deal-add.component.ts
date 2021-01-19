import { Component, Input } from '@angular/core';
import { GlobalService } from '@services';
import { CampaignVM, PipelineVM } from '@view-models';

@Component({
  selector: 'app-deal-add',
  templateUrl: './deal-add.component.html',
  styleUrls: ['./deal-add.component.scss']
})
export class DealAddComponent {
  @Input() isMain: boolean;
  @Input() canAdd: boolean;
  @Input() campaign: CampaignVM;
  @Input() pipeline: PipelineVM;
  @Input() for: 'basic' | 'campaign' = 'basic';
  constructor(
    protected readonly globalService: GlobalService,
  ) { }

  useAdd() {
    this.globalService.triggerView$.next({ type: 'deal', payload: { campaign: this.campaign, pipeline: this.campaign ? this.campaign.pipeline: this.pipeline, fix: !this.isMain, for: this.for } });
  }
}
