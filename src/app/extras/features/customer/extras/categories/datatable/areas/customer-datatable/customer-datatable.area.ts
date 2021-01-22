import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ICustomerMainState } from '@extras/features/customer';
import { ISort } from '@extras/interfaces';
import { NbToastrService } from '@nebular/theme';
import { CustomerService } from '@services';
import { CustomerVM } from '@view-models';
import { of, Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import swal from 'sweetalert2';

@Component({
  selector: 'app-customer-datatable',
  templateUrl: './customer-datatable.area.html',
  styleUrls: ['./customer-datatable.area.scss']
})
export class CustomerDatatableArea implements OnDestroy {
  @Output() useSortState: EventEmitter<ISort> = new EventEmitter<ISort>();
  @Output() useCheck: EventEmitter<{formControl: FormControl, customer: CustomerVM}[]> = new EventEmitter<{formControl: FormControl, customer: CustomerVM}[]>();
  headerCheck = new FormControl('off');
  checkList: {formControl: FormControl, customer: CustomerVM}[] = [];
  @Input() state: ICustomerMainState;
  @Input() sort: ISort;
  @Input() isMain: boolean;
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly service: CustomerService,
    protected readonly toastrService: NbToastrService,
  ) { }
  ngOnChanges() {
    this.headerCheck.setValue('off');
    console.log(this.state);
    this.checkList = this.state.paginationArray.map((customer) => ({
      customer,
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
      this.checkList = this.state.paginationArray.map((customer) => ({
        customer,
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
      title: 'Remove an customer?',
      text: 'When you click OK button, an customer will be remove out of system and can not backup',
      showCancelButton: true,
    });
    if (rs.isConfirmed) {
      // const subscription = this.service.remove(id)
      //   .pipe(
      //     tap((data) => {
      //       this.toastrService.success('', 'Remove customer successful', { duration: 3000 });
      //     }),
      //     catchError((err) => {
      //       this.toastrService.danger('', 'Remove customer fail! ' + err.message, { duration: 3000 });
      //       return of(undefined);
      //     })
      //   ).subscribe(console.log);
      // this.subscriptions.push(subscription);
    }
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
