import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { IPipelineMainState } from '@extras/features/pipeline';
import { ISort } from '@extras/interfaces';
import { NbToastrService } from '@nebular/theme';
import { PipelineService } from '@services';
import { PipelineVM } from '@view-models';
import { of, Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import swal from 'sweetalert2';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-pipeline-datatable',
  templateUrl: './pipeline-datatable.area.html',
  styleUrls: ['./pipeline-datatable.area.scss']
})
export class PipelineDatatableArea implements OnDestroy {
  @Output() useSortState: EventEmitter<ISort> = new EventEmitter<ISort>();
  @Output() useCheck: EventEmitter<{formControl: FormControl, pipeline: PipelineVM}[]> = new EventEmitter<{formControl: FormControl, pipeline: PipelineVM}[]>();
  headerCheck = new FormControl('off');
  checkList: {formControl: FormControl, pipeline: PipelineVM}[] = [];
  @Input() state: IPipelineMainState;
  @Input() sort: ISort;
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly service: PipelineService,
    protected readonly toastrService: NbToastrService,
  ) { }
  ngOnChanges() {
    this.headerCheck.setValue('off');
    console.log(this.state);
    this.checkList = this.state.paginationArray.map((pipeline) => ({
      pipeline,
      formControl: new FormControl(false),
    }))
    this.useCheck.emit(this.checkList.filter((e) => e.formControl.value));
  }
  useSort = (sort: { key: string, stage: 'down' | 'up' }) => {
    this.useSortState.emit(sort);
  }
  async useRemove(id: string) {
    const rs = await swal.fire({
      title: 'Remove an process?',
      text: 'When you click OK button, an process will be remove out of system and can not backup',
      showCancelButton: true,
    });
    if (rs.isConfirmed) {
      const subscription = this.service.remove(id)
        .pipe(
          tap((data) => {
            this.toastrService.success('', 'Remove process successful', { duration: 3000 });
          }),
          catchError((err) => {
            this.toastrService.danger('', 'Remove process fail! ' + err.message, { duration: 3000 });
            return of(undefined);
          })
        ).subscribe(console.log);
      this.subscriptions.push(subscription);
    }
  }
  useItemCheck(isHeader: boolean) {
    if (isHeader) {
      const value = this.headerCheck.value === 'on';
      this.checkList = this.state.paginationArray.map((pipeline) => ({
        pipeline,
        formControl: new FormControl(value),
      }))
    } else {
      const size = this.checkList.filter((e) => e.formControl.value).length;
      this.headerCheck.setValue(size > 0 ? (size === this.checkList.length ? 'on' : 'indeterminate') : 'off');
    }
    this.useCheck.emit(this.checkList.filter((e) => e.formControl.value));
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
