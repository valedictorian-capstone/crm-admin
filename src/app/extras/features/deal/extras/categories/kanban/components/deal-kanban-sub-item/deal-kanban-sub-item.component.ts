import { Clipboard } from '@angular/cdk/clipboard';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { DealService, GlobalService } from '@services';
import { DealVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-deal-kanban-sub-item',
  templateUrl: './deal-kanban-sub-item.component.html',
  styleUrls: ['./deal-kanban-sub-item.component.scss']
})
export class DealKanbanSubItemComponent {
  @Output() useToggleState: EventEmitter<any> = new EventEmitter<any>();
  @Output() useSortable: EventEmitter<any> = new EventEmitter<any>();
  @Output() useRemove: EventEmitter<any> = new EventEmitter<any>();
  @Input() deal: DealVM & { changing: boolean };
  @Input() canUpdate = false;
  @Input() canRemove = false;
  @Input() isHeader = false;
  @Input() search: string;
  @Input() stage: string;
  @Input() dragging = false;
  @Input() isMain: boolean;
  @Input() for: 'basic' | 'campaign' = 'basic';
  @Input() sort = {
    key: '',
    stage: 'up'
  };
  constructor(
    protected readonly globalService: GlobalService,
    protected readonly spinner: NgxSpinnerService,
    protected readonly clipboard: Clipboard,
    protected readonly service: DealService,
    protected readonly toastrService: NbToastrService,
    protected readonly router: Router,
  ) {
  }
  useEdit() {
    this.globalService.triggerView$.next({ type: 'deal', payload: { deal: this.deal, fix: !this.isMain, for: this.for } });
  }
  useView() {
    this.router.navigate(['core/deal/' + this.deal.id]);
  }
  useCopy(data: string) {
    this.clipboard.copy(data);
    this.toastrService.show('', 'Copy successful', { position: NbGlobalPhysicalPosition.TOP_RIGHT, status: 'success' });
  }
  useSort(key: string) {
    if (this.sort.key === key) {
      this.sort.stage = this.sort.stage === 'up' ? 'down' : 'up';
    } else {
      this.sort.key = key;
    }
    this.useSortable.emit(this.sort);
  }
}
