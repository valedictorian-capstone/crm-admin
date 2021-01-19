import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ILogMainState } from '@extras/features';
import { ISort } from '@extras/interfaces';
import { NbToastrService } from '@nebular/theme';
import { LogService } from '@services';
import { CampaignVM, DealVM, LogVM } from '@view-models';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';

@Component({
  selector: 'app-log-datatable',
  templateUrl: './log-datatable.area.html',
  styleUrls: ['./log-datatable.area.scss']
})
export class LogDatatableArea implements OnDestroy {
  @Output() useSortState: EventEmitter<ISort> = new EventEmitter<ISort>();
  @Output() useCheck: EventEmitter<{formControl: FormControl, log: LogVM}[]> = new EventEmitter<{formControl: FormControl, log: LogVM}[]>();
  @Input() state: ILogMainState;
  @Input() sort: ISort;
  @Input() isMain: boolean;
  @Input() for: string;
  @Input() campaign: CampaignVM;
  @Input() deal: DealVM;
  headerCheck = new FormControl('radio-button-off-outline');
  checkList: {formControl: FormControl, log: LogVM}[] = [];
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly service: LogService,
    protected readonly toastrService: NbToastrService,
  ) { }
  ngOnChanges() {
    this.headerCheck.setValue('radio-button-off-outline');
    console.log(this.state);
    this.checkList = this.state.paginationArray.map((log) => ({
      log,
      formControl: new FormControl(false),
    }))
    this.useCheck.emit(this.checkList.filter((e) => e.formControl.value));
  }
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
  useItemCheck(isHeader: boolean) {
    if (isHeader) {
      const value = this.headerCheck.value === 'radio-button-on-outline';
      this.checkList = this.state.paginationArray.map((log) => ({
        log,
        formControl: new FormControl(value),
      }))
    } else {
      const size = this.checkList.filter((e) => e.formControl.value).length;
      this.headerCheck.setValue(size > 0 ? (size === this.checkList.length ? 'radio-button-on-outline' : 'minus-circle-outline') : 'radio-button-off-outline');
    }
    this.useCheck.emit(this.checkList.filter((e) => e.formControl.value));
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
