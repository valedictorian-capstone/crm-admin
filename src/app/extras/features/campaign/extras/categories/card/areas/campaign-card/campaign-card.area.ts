import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ICampaignMainState } from '@extras/features/campaign';
import { ISort } from '@extras/interfaces';
import { NbToastrService } from '@nebular/theme';
import { CampaignService } from '@services';
import { CampaignVM } from '@view-models';
import { of, Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import swal from 'sweetalert2';

@Component({
  selector: 'app-campaign-card',
  templateUrl: './campaign-card.area.html',
  styleUrls: ['./campaign-card.area.scss']
})
export class CampaignCardArea implements OnDestroy {
  @Output() useSortState: EventEmitter<ISort> = new EventEmitter<ISort>();
  @Output() useCheck: EventEmitter<{formControl: FormControl, campaign: CampaignVM}[]> = new EventEmitter<{formControl: FormControl, campaign: CampaignVM}[]>();
  checkList: {formControl: FormControl, campaign: CampaignVM}[] = [];
  @Input() state: ICampaignMainState;
  @Input() sort: ISort;
  @Input() isMain: boolean;
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly service: CampaignService,
    protected readonly toastrService: NbToastrService,
  ) { }
  ngOnChanges() {
    this.checkList = this.state.paginationArray.map((campaign) => ({
      campaign,
      formControl: new FormControl(false),
    }))
    this.useCheck.emit(this.checkList.filter((e) => e.formControl.value));
  }
  useSort = (sort: { key: string, stage: 'down' | 'up' }) => {
    this.useSortState.emit(sort);
  }
  async useRemove(id: string, status: string) {
    if (status === 'planning') {
      const rs = await swal.fire({
        title: 'Remove an campaign?',
        text: 'When you click OK button, an campaign will be remove out of system and can not backup',
        showCancelButton: true,
      });
      if (rs.isConfirmed) {
        const subscription = this.service.remove(id)
          .pipe(
            tap((data) => {
              this.toastrService.success('', 'Remove campaign successful', { duration: 3000 });
            }),
            catchError((err) => {
              this.toastrService.danger('', 'Remove campaign fail! ' + err.message, { duration: 3000 });
              return of(undefined);
            })
          ).subscribe(console.log);
        this.subscriptions.push(subscription);
      }
    } else {
      swal.fire('You can not remove this campaign because it is started or ended', '', 'error');
    }
  }
  useItemCheck() {
    this.useCheck.emit(this.checkList.filter((e) => e.formControl.value));
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
