import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { GlobalService } from '@services';
import { authSelector } from '@store/selectors';
import { State } from '@store/states';
import { AccountVM } from '@view-models';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

interface IEmployeeItemComponentState {
  you: AccountVM;
  canUpdate: boolean;
}
@Component({
  selector: 'app-reuse-employee-item',
  templateUrl: './employee-item.component.html',
  styleUrls: ['./employee-item.component.scss']
})
export class EmployeeItemComponent implements OnInit, OnDestroy {
  @Input() employee: AccountVM;
  @Input() search: string;
  subscriptions: Subscription[] = [];
  state: IEmployeeItemComponentState = {
    you: undefined,
    canUpdate: false,
  }
  constructor(
    protected readonly globalService: GlobalService,
    protected readonly toastrService: NbToastrService,
    protected readonly clipboard: Clipboard,
    protected readonly store: Store<State>
  ) {
  }
  ngOnInit() {
    this.useLoadMine();
  }
  useLoadMine = () => {
    const subscription = this.store.select(authSelector.profile)
      .pipe(
        tap((profile) => {
          this.state.you = profile;
          this.state.canUpdate = this.state.you.roles.filter((role) => role.canAccessRole).length > 0 && Math.min(...this.state.you.roles.map((e) => e.level)) < Math.min(...this.employee.roles.map((e) => e.level));
        })
      )
      .subscribe();
    this.subscriptions.push(subscription);
  }
  useEdit = () => {
    this.globalService.triggerView$.next({ type: 'employee', payload: { employee: this.employee } });
  }
  useView = () => {
    this.globalService.triggerView$.next({ type: 'employee', payload: { employee: this.employee, isProfile: true } });
  }
  usePhone = (phone: string) => {
    window.open('tel:' + phone, '_self');
  }
  useMail = (email: string) => {
    this.globalService.triggerView$.next({ type: 'mail', payload: { email } });
  }
  useCopy = (link: string) => {
    this.clipboard.copy(link);
    this.toastrService.show('', 'Copy successful', { position: NbGlobalPhysicalPosition.TOP_RIGHT, status: 'success' });
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
