import { Clipboard } from '@angular/cdk/clipboard';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { PipelineService, GlobalService } from '@services';
import { PipelineVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-pipeline-datatable-item',
  templateUrl: './pipeline-datatable-item.component.html',
  styleUrls: ['./pipeline-datatable-item.component.scss']
})
export class PipelineDatatableItemComponent {
  @Output() useToggleState: EventEmitter<any> = new EventEmitter<any>();
  @Output() useSortable: EventEmitter<any> = new EventEmitter<any>();
  @Output() useRemove: EventEmitter<any> = new EventEmitter<any>();
  @Output() useItemCheck: EventEmitter<any> = new EventEmitter<any>();
  @Input() control: FormControl;
  @Input() pipeline: PipelineVM;
  @Input() canUpdate = false;
  @Input() canRemove = false;
  @Input() isHeader = false;
  @Input() sort = {
    key: '',
    stage: 'up'
  };
  constructor(
    protected readonly globalService: GlobalService,
    protected readonly spinner: NgxSpinnerService,
    protected readonly clipboard: Clipboard,
    protected readonly service: PipelineService,
    protected readonly toastrService: NbToastrService,
    protected readonly router: Router,
  ) {
  }
  useEdit() {
    this.globalService.triggerView$.next({ type: 'pipeline', payload: { pipeline: this.pipeline} });
  }
  useView() {
    this.router.navigate(['core/pipeline/' + this.pipeline.id]);
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
