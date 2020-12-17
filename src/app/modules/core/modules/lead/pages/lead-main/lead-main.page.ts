import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { CustomerService, GlobalService } from '@services';
import { CustomerAction } from '@store/actions';
import { authSelector, customerSelector } from '@store/selectors';
import { State } from '@store/states';
import { AccountVM, CustomerVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
interface ILeadMainPageState {
  array: CustomerVM[];
  filterArray: CustomerVM[];
  search: {
    value: string;
  };
  you: AccountVM;
  canAdd: boolean;
  canImport: boolean;
  canUpdate: boolean;
  canRemove: boolean;
}
@Component({
  selector: 'app-lead-main',
  templateUrl: './lead-main.page.html',
  styleUrls: ['./lead-main.page.scss'],
})
export class LeadMainPage implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  state: ILeadMainPageState = {
    array: [],
    filterArray: [],
    search: {
      value: '',
    },
    you: undefined,
    canAdd: false,
    canImport: false,
    canUpdate: false,
    canRemove: false,
  };
  constructor(
    protected readonly customerService: CustomerService,
    protected readonly globalService: GlobalService,
    protected readonly spinner: NgxSpinnerService,
    protected readonly activatedRoute: ActivatedRoute,
    protected readonly store: Store<State>
  ) {
    this.useLoadMine();
  }

  ngOnInit() {
    this.useDispatch();
  }
  useLoadMine = () => {
    const subscription = this.store.select(authSelector.profile)
      .pipe(
        tap((profile) => {
          this.state.you = profile;
          this.state.canAdd = this.state.you.roles.filter((role) => role.canCreateCustomer).length > 0;
          this.state.canImport = this.state.you.roles.filter((role) => role.canImportCustomer).length > 0;
          this.state.canUpdate = this.state.you.roles.filter((role) => role.canUpdateCustomer).length > 0;
          this.state.canRemove = this.state.you.roles.filter((role) => role.canRemoveCustomer).length > 0;
        })
      )
      .subscribe();
    this.subscriptions.push(subscription);
  }
  useDispatch = () => {
    const subscription = this.store.select((state) => state.customer)
      .pipe(
        tap((customer) => {
          const firstLoad = customer.firstLoad;
          const data = (customer.ids as string[]).map((id) => customer.entities[id]);
          if (!firstLoad) {
            this.useReload();
          } else {
            this.state.array = data.filter((e) => e.groups.filter((group) => group.id === '3').length > 0);
            this.useFilter();
          }
        })
    ).subscribe()
    this.subscriptions.push(subscription);
  }
  useReload = () => {
    this.useShowSpinner();
    this.store.dispatch(CustomerAction.FindAllAction({
      finalize: () => {
        this.useHideSpinner();
      }
    }));
  }
  useFilter = () => {
    this.state.filterArray = this.state.array.filter((e) =>
      (e.fullname.toLowerCase().includes(this.state.search.value.toLowerCase()) ||
        e.phone.toLowerCase().includes(this.state.search.value.toLowerCase()) ||
        e.email.toLowerCase().includes(this.state.search.value.toLowerCase()))
    );
  }
  usePlus = () => {
    this.globalService.triggerView$.next({ type: 'customer', payload: {} });
  }
  useImport = () => {
    this.globalService.triggerView$.next({ type: 'import', payload: { importType: 'customer' } });
  }
  useSearch = (search: {
    value: string;
  }) => {
    console.log(search);
    this.state.search = { ...this.state.search, ...search };
    this.useFilter();
  }
  useShowSpinner = () => {
    this.spinner.show('lead-main');
  }
  useHideSpinner = () => {
    setTimeout(() => {
      this.spinner.hide('lead-main');
    }, 1000);
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
