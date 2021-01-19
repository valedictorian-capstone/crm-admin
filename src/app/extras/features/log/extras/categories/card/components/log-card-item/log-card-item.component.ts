import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CampaignVM, DealVM, LogVM } from '@view-models';
@Component({
  selector: 'app-log-card-item',
  templateUrl: './log-card-item.component.html',
  styleUrls: ['./log-card-item.component.scss']
})
export class LogCardItemComponent {
  @Output() useSortable: EventEmitter<any> = new EventEmitter<any>();
  @Output() useRemove: EventEmitter<any> = new EventEmitter<any>();
  @Input() log: LogVM;
  @Input() campaign: CampaignVM;
  @Input() deal: DealVM;
  @Input() sort = {
    key: '',
    stage: 'up'
  };
  useSort(key: string) {
    if (this.sort.key === key) {
      this.sort.stage = this.sort.stage === 'up' ? 'down' : 'up';
    } else {
      this.sort.key = key;
    }
    this.useSortable.emit(this.sort);
  }
}
