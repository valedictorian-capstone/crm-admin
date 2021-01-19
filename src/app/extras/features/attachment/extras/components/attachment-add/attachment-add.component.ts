import { Component, Input } from '@angular/core';
import { GlobalService } from '@services';
import { CampaignVM, DealVM } from '@view-models';

@Component({
  selector: 'app-attachment-add',
  templateUrl: './attachment-add.component.html',
  styleUrls: ['./attachment-add.component.scss']
})
export class AttachmentAddComponent {
  @Input() canAdd: boolean;
  @Input() isMain: boolean;
  @Input() campaign: CampaignVM;
  @Input() deal: DealVM;
  @Input() for: 'deal' | 'campaign' = 'deal';
  constructor(
    protected readonly globalService: GlobalService,
  ) { }

  useAdd() {
    this.globalService.triggerView$.next({ type: 'attachment', payload: { for: this.campaign ? 'campaign' : (this.deal ? 'deal' : this.for), campaign: this.campaign, deal: this.deal, fix: !this.isMain } });
  }
}
