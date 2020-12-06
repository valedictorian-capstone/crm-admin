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
  }
  useToggleDone = () => {
    this.activityService.update({
      id: this.data.id,
      status: this.data.status === 'processing' ? 'done' : 'processing'
    } as any).subscribe();
  }
  useRemove = (ref: NbDialogRef<any>) => {
    ref.close();
    this.activityService.remove(this.data.id).subscribe();
  }
  useDialog(template: TemplateRef<any>) {
    this.dialogService.open(template, { closeOnBackdropClick: true });
  }
  useEdit = () => {
    this.globalService.triggerView$.next({ type: 'activity', payload: { activity: this.data } });
  }
}
