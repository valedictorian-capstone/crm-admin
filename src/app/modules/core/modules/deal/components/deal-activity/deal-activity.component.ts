import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { ActivityService, GlobalService } from '@services';
import { ActivityVM } from '@view-models';

@Component({
  selector: 'app-deal-activity',
  templateUrl: './deal-activity.component.html',
  styleUrls: ['./deal-activity.component.scss']
})
export class DealActivityComponent implements OnInit {
  @Input() data: ActivityVM & {last?: boolean, state: string};
  constructor(
    protected readonly activityService: ActivityService,
    protected readonly globalService: GlobalService,
    protected readonly dialogService: NbDialogService,
  ) { }

  ngOnInit() {
    console.log(this.data);
  }
  useToggleDone = () => {
    this.activityService.update({
      id: this.data.id,
      status: this.data.status === 'processing' ? 'done' : 'processing'
    } as any).subscribe((data) => {
      this.activityService.triggerValue$.next({ type: 'update', data });
    });
  }
  useRemove = (ref: NbDialogRef<any>) => {
    ref.close();
    this.activityService.remove(this.data.id).subscribe(() => {
      this.activityService.triggerValue$.next({ type: 'remove', data: this.data });
    });
  }
  useDialog(template: TemplateRef<any>) {
    this.dialogService.open(template, { closeOnBackdropClick: true });
  }
  useEdit = () => {
    this.globalService.triggerView$.next({ type: 'activity', payload: { activity: this.data } });
  }
}
