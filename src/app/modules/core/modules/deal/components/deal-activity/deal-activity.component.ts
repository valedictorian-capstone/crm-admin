import { Component, Input, OnDestroy, TemplateRef } from '@angular/core';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { ActivityService, GlobalService } from '@services';
import { ActivityVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-deal-activity',
  templateUrl: './deal-activity.component.html',
  styleUrls: ['./deal-activity.component.scss']
})
export class DealActivityComponent implements OnDestroy {
  @Input() data: ActivityVM & { last?: boolean, state: string };
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly activityService: ActivityService,
    protected readonly globalService: GlobalService,
    protected readonly dialogService: NbDialogService,
    protected readonly spinner: NgxSpinnerService,
  ) { }
  useToggleDone = () => {
    this.useShowSpinner();
    this.subscriptions.push(
      this.activityService.update({
        id: this.data.id,
        status: this.data.status === 'processing' ? 'done' : 'processing'
      } as any)
        .pipe(
          finalize(() => this.useHideSpinner())
        )
        .subscribe()
    );
  }
  useRemove = (ref: NbDialogRef<any>) => {
    ref.close();
    this.useShowSpinner();
    this.subscriptions.push(
      this.activityService.remove(this.data.id)
        .pipe(
          finalize(() => this.useHideSpinner())
        )
        .subscribe()
    );
  }
  useDialog(template: TemplateRef<any>) {
    this.dialogService.open(template, { closeOnBackdropClick: true });
  }
  useEdit = () => {
    this.globalService.triggerView$.next({ type: 'activity', payload: { activity: this.data } });
  }
  useShowSpinner = () => {
    this.spinner.show('deal-activity-' + this.data.id);
  }
  useHideSpinner = () => {
    this.spinner.hide('deal-activity-' + this.data.id);
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
