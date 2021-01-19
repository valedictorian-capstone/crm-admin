import { Clipboard } from '@angular/cdk/clipboard';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { CustomerService, DealService, GlobalService, TicketService } from '@services';
import { AccountVM, CustomerVM, DealVM, TicketVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { finalize, switchMap, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { State } from '@store/states';
import { authSelector } from '@store/selectors';

interface ICustomerProfilePageState {
  you: AccountVM;
  tickets: TicketVM[];
  deals: DealVM[];
  visible: boolean;
  canUpdate: boolean;
}
@Component({
  selector: 'app-reuse-customer-profile',
  templateUrl: './customer-profile.page.html',
  styleUrls: ['./customer-profile.page.scss']
})
export class CustomerProfilePage implements OnInit, OnDestroy {
  @Input() payload: {
    customer: CustomerVM
  } = {
      customer: undefined
    };
  @Output() useClose: EventEmitter<any> = new EventEmitter<any>();
  subscriptions: Subscription[] = [];
  state: ICustomerProfilePageState = {
    you: undefined,
    tickets: [],
    deals: [],
    visible: false,
    canUpdate: false,
  };
  constructor(
    protected readonly service: CustomerService,
    protected readonly ticketService: TicketService,
    protected readonly dealService: DealService,
    protected readonly globalService: GlobalService,
    protected readonly toastrService: NbToastrService,
    protected readonly clipboard: Clipboard,
    protected readonly spinner: NgxSpinnerService,
    protected readonly activatedRoute: ActivatedRoute,
    protected readonly store: Store<State>
  ) {
    this.useLoadMine();
  }

  ngOnInit() {
    this.useReload();
  }
  useLoadMine = () => {
    const subscription = this.store.select(authSelector.profile)
      .pipe(
        tap((profile) => {
          if (profile) {
            this.state.you = profile;
            this.state.canUpdate = this.state.you.roles.filter((role) => role.canUpdateCustomer).length > 0;
          }
        })
      )
      .subscribe();
    this.subscriptions.push(subscription);
  }
  useReload = () => {
    this.useShowSpinner();
    const subscription = this.service
      .findById(this.payload.customer.id)
      .pipe(
        tap((data) => this.payload.customer = data),
        switchMap(() => this.ticketService.findByCustomerId(this.payload.customer.id)),
        tap((data) => this.state.tickets = data),
        switchMap(() => this.dealService.findByCustomerId(this.payload.customer.id)),
        tap((data) => this.state.deals = data),
        finalize(() => {
          this.useHideSpinner();
        })
      )
      .subscribe();
    this.subscriptions.push(subscription);
  }
  useEdit = () => {
    this.useClose.emit();
    this.globalService.triggerView$.next({ type: 'customer', payload: this.payload });
  }
  usePhone = (phone: string) => {
    window.open('tel:' + phone, '_self');
  }
  useMail = (email: string) => {
    this.globalService.triggerView$.next({ type: 'mail', payload: { email } });
  }
  useOpen = (link: string) => {
    window.open(link, '_blank');
  }
  useCopy = (link: string) => {
    this.clipboard.copy(link);
    this.toastrService.show('', 'Copy successful', { position: NbGlobalPhysicalPosition.TOP_RIGHT, status: 'success' });
  }
  useSkype = () => {
    window.open('skype:' + this.payload.customer.skypeName + '?chat', '_self');
  }
  useShowSpinner = () => {
    this.spinner.show('customer-profile');
  }
  useHideSpinner = () => {
    setTimeout(() => {
      this.spinner.hide('customer-profile');
    }, 1000);
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
