import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ICampaignMainState } from '@extras/features/campaign';
@Component({
  selector: 'app-campaign-page-count',
  templateUrl: './campaign-page-count.component.html',
  styleUrls: ['./campaign-page-count.component.scss']
})
export class CampaignPageCountComponent {
  @Output() useSelectPageCount: EventEmitter<any> = new EventEmitter<any>();
  @Input() state: ICampaignMainState;
}
