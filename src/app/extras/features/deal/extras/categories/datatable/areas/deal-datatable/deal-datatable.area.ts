import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IDealMainState } from '@extras/features/deal';
import { ISort } from '@extras/interfaces';
import { NbToastrService } from '@nebular/theme';
import { DealService } from '@services';
import { CampaignVM, DealVM } from '@view-models';
import { of, Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import swal from 'sweetalert2';

@Component({
  selector: 'app-deal-datatable',
  templateUrl: './deal-datatable.area.html',
  styleUrls: ['./deal-datatable.area.scss']
})
export class DealDatatableArea implements OnDestroy {
  @Output() useSortState: EventEmitter<ISort> = new EventEmitter<ISort>();
  @Output() useCheck: EventEmitter<{formControl: FormControl, deal: DealVM}[]> = new EventEmitter<{formControl: FormControl, deal: DealVM}[]>();
  headerCheck = new FormControl('radio-button-off-outline');
  checkList: {formControl: FormControl, deal: DealVM}[] = [];
  @Input() state: IDealMainState;
  @Input() sort: ISort;
  @Input() isMain: boolean;
  @Input() for: 'basic' | 'campaign' = 'basic';
  @Input() campaign: CampaignVM;
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly service: DealService,
    protected readonly toastrService: NbToastrService,
  ) { }
  ngOnChanges() {
    this.headerCheck.setValue('radio-button-off-outline');
    console.log(this.state);
    this.checkList = this.state.paginationArray.map((deal) => ({
      deal,
      formControl: new FormControl(false),
    }))
    this.useCheck.emit(this.checkList.filter((e) => e.formControl.value));
  }
  useSort = (sort: { key: string, stage: 'down' | 'up' }) => {
    this.useSortState.emit(sort);
  }
  async useRemove(id: string) {
    const rs = await swal.fire({
      title: 'Remove an deal?',
      text: 'When you click OK button, an deal will be remove out of system and can not backup',
      showCancelButton: true,
    });
    if (rs.isConfirmed) {
      const subscription = this.service.remove(id)
        .pipe(
          tap((data) => {
            this.toastrService.success('', 'Remove deal successful', { duration: 3000 });
          }),
          catchError((err) => {
            this.toastrService.danger('', 'Remove deal fail! ' + err.message, { duration: 3000 });
            return of(undefined);
          })
        ).subscribe(console.log);
      this.subscriptions.push(subscription);
    }
  }
  useItemCheck(isHeader: boolean) {
    if (isHeader) {
      const value = this.headerCheck.value === 'radio-button-on-outline';
      this.checkList = this.state.paginationArray.map((deal) => ({
        deal,
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
