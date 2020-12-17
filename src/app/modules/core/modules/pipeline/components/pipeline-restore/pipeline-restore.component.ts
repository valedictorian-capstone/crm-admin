import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { PipelineService } from '@services';
import { PipelineVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { of, Subscription } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';

@Component({
  selector: 'app-pipeline-restore',
  templateUrl: './pipeline-restore.component.html',
  styleUrls: ['./pipeline-restore.component.scss']
})
export class PipelineRestoreComponent implements OnDestroy {
  @Output() useDone: EventEmitter<PipelineVM> = new EventEmitter<PipelineVM>();
  @Output() useClose: EventEmitter<any> = new EventEmitter<any>();
  @Input() pipelines: PipelineVM[] = [];
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly pipelineService: PipelineService,
    protected readonly spinner: NgxSpinnerService,
    protected readonly toastrService: NbToastrService,
  ) { }

  useRestore = (id: string) => {
    this.useShowSpinner();
    this.subscriptions.push(
      this.pipelineService.restore(id)
        .pipe(
          tap((data) => {
            this.toastrService.success('', 'Restore process successful', { duration: 3000 });
          }),
          catchError((err) => {
            this.toastrService.success('', 'Restore process fail! ' + err.message, { duration: 3000 });
            return of(undefined);
          }),
          finalize(() => {
            this.useHideSpinner();
          })
        ).subscribe()
    );

  }
  useShowSpinner = () => {
    this.spinner.show('pipeline-restore');
  }
  useHideSpinner = () => {
    this.spinner.hide('pipeline-restore');
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
