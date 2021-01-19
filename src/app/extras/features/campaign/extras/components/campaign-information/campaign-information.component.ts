import { Component, Input } from '@angular/core';
import { GlobalService } from '@services';
import { CampaignVM } from '@view-models';

@Component({
  selector: 'app-campaign-information',
  templateUrl: './campaign-information.component.html',
  styleUrls: ['./campaign-information.component.scss']
})
export class CampaignInformationComponent {
  @Input() campaign: CampaignVM;
  @Input() canUpdate = false;
  @Input() canRemove = false;
  show = true;
  constructor(
    protected readonly globalService: GlobalService,
  ) {
  }
  useEdit() {
    this.globalService.triggerView$.next({ type: 'campaign', payload: { campaign: this.campaign, for: 'campaign' } });
  }
}
