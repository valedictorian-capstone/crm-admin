import { Clipboard } from '@angular/cdk/clipboard';
import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { AccountService, GlobalService } from '@services';
import { AccountVM, RoleVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { State } from '@store/states';
import { Store } from '@ngrx/store';
import { authSelector } from '@store/selectors';
import { tap, catchError, finalize } from 'rxjs/operators';
import { Subscription, of } from 'rxjs';

@Component({
  selector: 'app-role-account',
  templateUrl: './role-account.component.html',
  styleUrls: ['./role-account.component.scss']
})
export class RoleAccountComponent implements OnInit, OnDestroy {
  @Output() useToggle: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() selectedRole: RoleVM;
  @Input() account: AccountVM;
  you: AccountVM;
  canUpdate = false;
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly service: AccountService,
    protected readonly globalService: GlobalService,
    protected readonly toastrService: NbToastrService,
    protected readonly spinner: NgxSpinnerService,
    protected readonly store: Store<State>
  ) {
  }
  ngOnInit() {
  }
  useEdit = () => {
    this.globalService.triggerView$.next({ type: 'employee', payload: { employee: this.account } });
  }
  useView = () => {
    this.globalService.triggerView$.next({ type: 'employee', payload: { employee: this.account, isProfile: true } });
  }
  usePhone = (phone: string) => {
    window.open('tel:' + phone, '_self');
  }
  useMail = (email: string) => {
    this.globalService.triggerView$.next({ type: 'mail', payload: { email } });
  }
  useCheckRole = () => {
    return this.account.roles.find((role) => role.id === this.selectedRole?.id);
  }
  useShowSpinner = () => {
    this.spinner.show('role-main');
  }
  useHideSpinner = () => {
    setTimeout(() => {
      this.spinner.hide('role-main');
    }, 1000);
  }
  useToggleRole = () => {
    this.useShowSpinner();
    const role = this.useCheckRole();
    let roles = this.account.roles;
    if (role) {
      roles = roles.filter((r) => r.id !== this.selectedRole.id);
    } else {
      roles = roles.concat([this.selectedRole]);
    }
    this.service.update({...this.account, roles})
    .pipe(
      tap((data) => {
        this.toastrService.success('', !role
          ? 'Set role for account successful' : 'Unset role for account successful', { duration: 3000 });
      }),
      catchError((err) => {
        this.toastrService.danger('', (!role
          ? 'Set role account fail! ' : 'Unset role account fail! ') + err.message, { duration: 3000 });
        return of(undefined);
      }),
      finalize(() => {
        this.useHideSpinner();
      })
    )
      .subscribe();
  }
  useToggleState = () => {
    this.useShowSpinner();
    const subscription = this.service.update({
      id: this.account.id,
      isDelete: !this.account.isDelete
    } as any)
      .pipe(
        tap((data) => {
          this.account.isDelete = !this.account.isDelete;
          this.toastrService.success('', !this.account.isDelete
            ? 'Disabled account successful' : 'Active account successful', { duration: 3000 });
        }),
        catchError((err) => {
          (err);
          this.toastrService.danger('', (!this.account.isDelete
            ? 'Disabled account fail! ' : 'Active account fail! ') + err.message, { duration: 3000 });
          return of(undefined);
        }),
        finalize(() => {
          this.useHideSpinner();
        })
      )
      .subscribe()
    this.subscriptions.push(subscription);
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
