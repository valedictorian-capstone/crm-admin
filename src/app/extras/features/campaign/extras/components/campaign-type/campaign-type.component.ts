import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-campaign-type',
  templateUrl: './campaign-type.component.html',
  styleUrls: ['./campaign-type.component.scss']
})
export class CampaignTypeComponent {
  @Input() type: 'datatable' | 'card';
  @Output() typeChange: EventEmitter<'datatable' | 'card'> = new EventEmitter<'datatable' | 'card'>();
}
