import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IEmployeeMainState } from '@extras/features/employee';
import { ISort } from '@extras/interfaces';
import { NbToastrService } from '@nebular/theme';
import { AccountService } from '@services';
import { AccountVM } from '@view-models';
import { of, Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import swal from 'sweetalert2';

@Component({
  selector: 'app-employee-datatable',
  templateUrl: './employee-datatable.area.html',
  styleUrls: ['./employee-datatable.area.scss']
})
export class EmployeeDatatableArea implements OnDestroy {
  @Output() useSortState: EventEmitter<ISort> = new EventEmitter<ISort>();
  @Output() useCheck: EventEmitter<{formControl: FormControl, employee: AccountVM}[]> = new EventEmitter<{formControl: FormControl, employee: AccountVM}[]>();
  headerCheck = new FormControl('radio-button-off-outline');
  checkList: {formControl: FormControl, employee: AccountVM}[] = [];
  @Input() state: IEmployeeMainState;
  @Input() sort: ISort;
  @Input() isMain: boolean;
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly service: AccountService,
    protected readonly toastrService: NbToastrService,
  ) { }
  ngOnChanges() {
    this.headerCheck.setValue('radio-button-off-outline');
    console.log(this.state);
    this.checkList = this.state.paginationArray.map((employee) => ({
      employee,
      formControl: new FormControl(false),
    }))
    this.useCheck.emit(this.checkList.filter((e) => e.formControl.value));
  }
  useSort = (sort: { key: string, stage: 'down' | 'up' }) => {
    this.useSortState.emit(sort);
  }
  useItemCheck(isHeader: boolean) {
    if (isHeader) {
      const value = this.headerCheck.value === 'radio-button-on-outline';
      this.checkList = this.state.paginationArray.map((employee) => ({
        employee,
        formControl: new FormControl(value),
      }))
    } else {
      const size = this.checkList.filter((e) => e.formControl.value).length;
      this.headerCheck.setValue(size > 0 ? (size === this.checkList.length ? 'radio-button-on-outline' : 'minus-circle-outline') : 'radio-button-off-outline');
    }
    this.useCheck.emit(this.checkList.filter((e) => e.formControl.value));
  }
  async useRemove(id: string) {
    const rs = await swal.fire({
      title: 'Remove an employee?',
      text: 'When you click OK button, an employee will be remove out of system and can not backup',
      showCancelButton: true,
    });
    if (rs.isConfirmed) {
      const subscription = this.service.remove(id)
        .pipe(
          tap((data) => {
            this.toastrService.success('', 'Remove employee successful', { duration: 3000 });
          }),
          catchError((err) => {
            this.toastrService.danger('', 'Remove employee fail! ' + err.message, { duration: 3000 });
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
