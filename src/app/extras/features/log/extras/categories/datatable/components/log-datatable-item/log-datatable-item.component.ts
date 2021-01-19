import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CampaignVM, DealVM, LogVM } from '@view-models';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-log-datatable-item',
  templateUrl: './log-datatable-item.component.html',
  styleUrls: ['./log-datatable-item.component.scss']
})
export class LogDatatableItemComponent {
  @Output() useSortable: EventEmitter<any> = new EventEmitter<any>();
  @Output() useRemove: EventEmitter<any> = new EventEmitter<any>();
  @Output() useItemCheck: EventEmitter<any> = new EventEmitter<any>();
  @Input() control: FormControl;
  @Input() log: LogVM;
  @Input() isHeader: boolean;
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
