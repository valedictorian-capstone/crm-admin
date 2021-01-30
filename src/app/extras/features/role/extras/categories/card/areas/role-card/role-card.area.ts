import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IRoleMainState } from '@extras/features/role';
import { ISort } from '@extras/interfaces';
import { NbToastrService } from '@nebular/theme';
import { RoleService } from '@services';
import { RoleVM } from '@view-models';
import { of, Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import swal from 'sweetalert2';

@Component({
  selector: 'app-role-card',
  templateUrl: './role-card.area.html',
  styleUrls: ['./role-card.area.scss']
})
export class RoleCardArea implements OnDestroy {
  @Output() useSortState: EventEmitter<ISort> = new EventEmitter<ISort>();
  @Output() useCheck: EventEmitter<{formControl: FormControl, role: RoleVM}[]> = new EventEmitter<{formControl: FormControl, role: RoleVM}[]>();
  checkList: {formControl: FormControl, role: RoleVM}[] = [];
  @Input() state: IRoleMainState;
  @Input() sort: ISort;
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly service: RoleService,
    protected readonly toastrService: NbToastrService,
  ) { }
  ngOnChanges() {
    this.checkList = this.state.paginationArray.map((role) => ({
      role,
      formControl: new FormControl(false),
    }))
    this.useCheck.emit(this.checkList.filter((e) => e.formControl.value));
  }
  useSort = (sort: { key: string, stage: 'down' | 'up' }) => {
    this.useSortState.emit(sort);
  }
  useItemCheck() {
    this.useCheck.emit(this.checkList.filter((e) => e.formControl.value));
  }
  async useRemove(id: string, length: number) {
    if (length === 0) {
      const rs = await swal.fire({
        title: 'Remove an role?',
        text: 'When you click OK button, an role will be remove out of system and can not backup',
        showCancelButton: true,
      });
      if (rs.isConfirmed) {
        const subscription = this.service.remove(id)
          .pipe(
            tap((data) => {
              this.toastrService.success('', 'Remove role successful', { duration: 3000 });
            }),
            catchError((err) => {
              this.toastrService.danger('', 'Remove role fail! ' + err.message, { duration: 3000 });
              return of(undefined);
            })
          ).subscribe(console.log);
        this.subscriptions.push(subscription);
      }
    } else {
      swal.fire('Can not remove this role', '', 'error');
    }
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
