import { Component, Input, OnDestroy, TemplateRef } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { GlobalService, LogService } from '@services';
import { LogVM } from '@view-models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-deal-log',
  templateUrl: './deal-log.component.html',
  styleUrls: ['./deal-log.component.scss']
})
export class DealLogComponent implements OnDestroy {
  @Input() data: LogVM;
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly logService: LogService,
    protected readonly globalService: GlobalService,
    protected readonly dialogService: NbDialogService,
  ) { }
  useDialog(template: TemplateRef<any>) {
    this.dialogService.open(template, { closeOnBackdropClick: true });
  }
  useEdit = () => {
    this.globalService.triggerView$.next({ type: 'log', payload: { log: this.data } });
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
