import { Component, Input, OnDestroy, TemplateRef } from '@angular/core';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { ActivityService, GlobalService } from '@services';
import { ActivityVM } from '@view-models';
import { Subscription } from 'rxjs';

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
  ) { }
  useToggleDone = () => {
    this.subscriptions.push(
      this.activityService.update({
        id: this.data.id,
        status: this.data.status === 'processing' ? 'done' : 'processing'
      } as any).subscribe()
    );
  }
  useRemove = (ref: NbDialogRef<any>) => {
    ref.close();
    this.subscriptions.push(
      this.activityService.remove(this.data.id).subscribe()
    );
  }
  useDialog(template: TemplateRef<any>) {
    this.dialogService.open(template, { closeOnBackdropClick: true });
  }
  useEdit = () => {
    this.globalService.triggerView$.next({ type: 'activity', payload: { activity: this.data } });
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
