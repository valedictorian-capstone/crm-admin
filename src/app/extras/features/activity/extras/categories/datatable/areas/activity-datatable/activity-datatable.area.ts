import { Component, OnInit, Output, Input, EventEmitter, OnDestroy, OnChanges } from '@angular/core';
import { IActivityMainState } from '@extras/features/activity';
import { ISort } from '@extras/interfaces';
import { NbToastrService } from '@nebular/theme';
import { ActivityService } from '@services';
import { catchError, tap } from 'rxjs/operators';
import swal from 'sweetalert2';
import { of, Subscription } from 'rxjs';
import { CampaignVM, DealVM, ActivityVM } from '@view-models';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-activity-datatable',
  templateUrl: './activity-datatable.area.html',
  styleUrls: ['./activity-datatable.area.scss']
})
export class ActivityDatatableArea implements OnDestroy, OnChanges {
  @Output() useSortState: EventEmitter<ISort> = new EventEmitter<ISort>();
  @Output() useCheck: EventEmitter<{formControl: FormControl, activity: ActivityVM}[]> = new EventEmitter<{formControl: FormControl, activity: ActivityVM}[]>();
  @Input() state: IActivityMainState;
  @Input() sort: ISort;
  @Input() isMain: boolean;
  @Input() for: string;
  @Input() campaign: CampaignVM;
  @Input() deal: DealVM;
  headerCheck = new FormControl('off');
  checkList: {formControl: FormControl, activity: ActivityVM}[] = [];
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly service: ActivityService,
    protected readonly toastrService: NbToastrService,
  ) {
  }
  ngOnChanges() {
    this.headerCheck.setValue('off');
    this.checkList = this.state.paginationArray.map((activity) => ({
      activity,
      formControl: new FormControl(false),
    }))
    this.useCheck.emit(this.checkList.filter((e) => e.formControl.value));
  }
  useSort = (sort: { key: string, stage: 'down' | 'up' }) => {
    this.useSortState.emit(sort);
  }
  async useRemove(id: string) {
    const rs = await swal.fire({
      title: 'Remove an activity?',
      text: 'When you click OK button, an activity will be remove out of system and can not backup',
      showCancelButton: true,
    });
    if (rs.isConfirmed) {
      const subscription = this.service.remove(id)
        .pipe(
          tap((data) => {
            this.toastrService.success('', 'Remove activity successful', { duration: 3000 });
          }),
          catchError((err) => {
            this.toastrService.danger('', 'Remove activity fail! ' + err.message, { duration: 3000 });
            return of(undefined);
          })
        ).subscribe(console.log);
      this.subscriptions.push(subscription);
    }
  }
  useItemCheck(isHeader: boolean) {
    if (isHeader) {
      const value = this.headerCheck.value === 'on';
      console.log(this.headerCheck.value);
      this.checkList = this.state.paginationArray.map((activity) => ({
        activity,
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
