import { Component, Input } from '@angular/core';
import { GlobalService } from '@services';
import { CampaignVM, DealVM } from '@view-models';
@Component({
  selector: 'app-note-add',
  templateUrl: './note-add.component.html',
  styleUrls: ['./note-add.component.scss']
})
export class NoteAddComponent {
  @Input() canAdd: boolean;
  @Input() isMain: boolean;
  @Input() campaign: CampaignVM;
  @Input() deal: DealVM;
  @Input() for: 'deal' | 'campaign';
  constructor(
    protected readonly globalService: GlobalService,
  ) { }

  useAdd() {
    this.globalService.triggerView$.next({ type: 'note', payload: { for: this.campaign ? 'campaign' : (this.deal ? 'deal' : this.for), campaign: this.campaign, deal: this.deal, fix: !this.isMain } });
  }
}
