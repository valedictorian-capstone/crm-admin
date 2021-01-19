import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { ILogMainState } from '@extras/features';
import { ISort } from '@extras/interfaces';
import { NbToastrService } from '@nebular/theme';
import { LogService } from '@services';
import { CampaignVM, DealVM } from '@view-models';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';

@Component({
  selector: 'app-log-card',
  templateUrl: './log-card.area.html',
  styleUrls: ['./log-card.area.scss']
})
export class LogCardArea implements OnDestroy {
  @Output() useSortState: EventEmitter<ISort> = new EventEmitter<ISort>();
  @Input() state: ILogMainState;
  @Input() sort: ISort;
  @Input() isMain: boolean;
  @Input() for: string;
  @Input() campaign: CampaignVM;
  @Input() deal: DealVM;
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly service: LogService,
    protected readonly toastrService: NbToastrService,
  ) { }
  useSort = (sort: { key: string, stage: 'down' | 'up' }) => {
    this.useSortState.emit(sort);
  }
  async useRemove(id: string) {
    const rs = await swal.fire({
      title: 'Remove an log?',
      text: 'When you click OK button, an log will be remove out of system and can not backup',
      showCancelButton: true,
    });
    // if (rs.isConfirmed) {
    //   const subscription = this.service.remove(id)
    //     .pipe(
    //       tap((data) => {
    //         this.toastrService.success('', 'Remove log successful', { duration: 3000 });
    //       }),
    //       catchError((err) => {
    //         this.toastrService.danger('', 'Remove log fail! ' + err.message, { duration: 3000 });
    //         return of(undefined);
    //       })
    //     ).subscribe(console.log);
    //   this.subscriptions.push(subscription);
    // }
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
