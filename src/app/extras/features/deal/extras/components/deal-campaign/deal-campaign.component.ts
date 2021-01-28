import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CampaignVM } from '@view-models';

@Component({
  selector: 'app-deal-campaign',
  templateUrl: './deal-campaign.component.html',
  styleUrls: ['./deal-campaign.component.scss']
})
export class DealCampaignComponent {
  @Input() campaign: CampaignVM;
  show = true;
  constructor(
    protected readonly router: Router,
  ) {
  }
  useView() {
    this.router.navigate(['core/campaign/' + this.campaign.id]);
  }

}
