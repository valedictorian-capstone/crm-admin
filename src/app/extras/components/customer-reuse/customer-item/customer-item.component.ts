import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Input, OnDestroy } from '@angular/core';
import { NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { GlobalService } from '@services';
import { authSelector } from '@store/selectors';
import { State } from '@store/states';
import { AccountVM, CustomerVM } from '@view-models';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
interface ICustomerItemComponentState {
  you: AccountVM;
  canUpdate: boolean;
}
@Component({
  selector: 'app-reuse-customer-item',
  templateUrl: './customer-item.component.html',
  styleUrls: ['./customer-item.component.scss']
})
export class CustomerItemComponent implements OnDestroy {
  @Input() customer: CustomerVM;
  @Input() search: string;
  subscriptions: Subscription[] = [];
  state: ICustomerItemComponentState = {
    you: undefined,
    canUpdate: false
  };
  constructor(
    protected readonly globalService: GlobalService,
    protected readonly toastrService: NbToastrService,
    protected readonly clipboard: Clipboard,
    protected readonly store: Store<State>
  ) {
    this.useLoadMine();
  }
  useLoadMine = () => {
    const subscription = this.store.select(authSelector.profile)
    .pipe(
      tap((profile) => {
        this.state.you = profile;
        this.state.canUpdate = this.state.you.roles.filter((role) => role.canUpdateCustomer).length > 0;
      })
    )
      .subscribe()
    this.subscriptions.push(subscription);
  }
  useEdit = () => {
    this.globalService.triggerView$.next({ type: 'customer', payload: { customer: this.customer } });
  }
  useView = () => {
    this.globalService.triggerView$.next({ type: 'customer-profile', payload: { customer: this.customer } });
  }
  usePhone = (phone: string) => {
    window.open('tel:' + phone, '_self');
  }
  useMail = (email: string) => {
    this.globalService.triggerView$.next({ type: 'mail', payload: { email } });
  }
  useCopy = (link: string) => {
    this.clipboard.copy(link);
    this.toastrService.show('', 'Copy successfull', { position: NbGlobalPhysicalPosition.TOP_RIGHT, status: 'success' });
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
