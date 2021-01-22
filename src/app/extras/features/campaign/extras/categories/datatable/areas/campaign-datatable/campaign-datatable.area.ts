import { Component, OnInit, Output, Input, EventEmitter, OnDestroy } from '@angular/core';
import { ICampaignMainState } from '@extras/features/campaign';
import { ISort } from '@extras/interfaces';
import { NbToastrService } from '@nebular/theme';
import { CampaignService } from '@services';
import { catchError, tap } from 'rxjs/operators';
import swal from 'sweetalert2';
import { of, Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { CampaignVM } from '@view-models';

@Component({
  selector: 'app-campaign-datatable',
  templateUrl: './campaign-datatable.area.html',
  styleUrls: ['./campaign-datatable.area.scss']
})
export class CampaignDatatableArea implements OnDestroy {
  @Output() useSortState: EventEmitter<ISort> = new EventEmitter<ISort>();
  @Output() useCheck: EventEmitter<{formControl: FormControl, campaign: CampaignVM}[]> = new EventEmitter<{formControl: FormControl, campaign: CampaignVM}[]>();
  headerCheck = new FormControl('off');
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
    this.headerCheck.setValue('off');
    console.log(this.state);
    this.checkList = this.state.paginationArray.map((campaign) => ({
      campaign,
      formControl: new FormControl(false),
    }))
    this.useCheck.emit(this.checkList.filter((e) => e.formControl.value));
  }
  useSort = (sort: { key: string, stage: 'down' | 'up' }) => {
    this.useSortState.emit(sort);
  }
  useItemCheck(isHeader: boolean) {
    if (isHeader) {
      const value = this.headerCheck.value === 'on';
      this.checkList = this.state.paginationArray.map((campaign) => ({
        campaign,
        formControl: new FormControl(value),
      }))
    } else {
      const size = this.checkList.filter((e) => e.formControl.value).length;
      this.headerCheck.setValue(size > 0 ? (size === this.checkList.length ? 'on' : 'indeterminate') : 'off');
    }
    this.useCheck.emit(this.checkList.filter((e) => e.formControl.value));
  }
  async useRemove(id: string) {
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
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
