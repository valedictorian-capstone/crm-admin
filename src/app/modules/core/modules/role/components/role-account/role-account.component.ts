import { Clipboard } from '@angular/cdk/clipboard';
import { Component, EventEmitter, Input, OnInit, Output, OnDestroy, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbGlobalPhysicalPosition, NbToastrService, NbDialogRef, NbDialogService } from '@nebular/theme';
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
    protected readonly dialogService: NbDialogService,
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
  useDialog = (template: TemplateRef<any>) => {
    this.dialogService.open(template, { closeOnBackdropClick: true });
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
          ? 'Set role for employee successful' : 'Unset role for employee successful', { duration: 3000 });
      }),
      catchError((err) => {
        this.toastrService.danger('', (!role
          ? 'Set role employee fail! ' : 'Unset role employee fail! ') + err.message, { duration: 3000 });
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
          this.toastrService.success('', !this.account.isDelete
            ? 'Disabled employee successful' : 'Active employee successful', { duration: 3000 });
        }),
        catchError((err) => {
          (err);
          this.toastrService.danger('', (!this.account.isDelete
            ? 'Disabled employee fail! ' : 'Active employee fail! ') + err.message, { duration: 3000 });
          return of(undefined);
        }),
        finalize(() => {
          this.useHideSpinner();
        })
      )
      .subscribe()
    this.subscriptions.push(subscription);
  }
  useRemove = (ref: NbDialogRef<any>) => {
    ref.close();
    this.useShowSpinner();
    const subscription = this.service.remove(this.account.id)
      .pipe(
        tap((data) => {
          this.toastrService.success('', 'Remove employee successful', { duration: 3000 });
        }),
        catchError((err) => {
          (err);
          this.toastrService.danger('', 'Remove employee fail! ' + err.message, { duration: 3000 });
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
