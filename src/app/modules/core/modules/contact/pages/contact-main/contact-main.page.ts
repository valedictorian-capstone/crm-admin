import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { CustomerService, GlobalService } from '@services';
import { CustomerAction } from '@store/actions';
import { authSelector, customerSelector } from '@store/selectors';
import { State } from '@store/states';
import { AccountVM, CustomerVM, GroupVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
interface IContactMainPageState {
  array: CustomerVM[];
  filterArray: CustomerVM[];
  search: {
    value: string;
    group: GroupVM
  };
  you: AccountVM;
  canAdd: boolean;
  canImport: boolean;
  canUpdate: boolean;
  canRemove: boolean;
}
@Component({
  selector: 'app-contact-main',
  templateUrl: './contact-main.page.html',
  styleUrls: ['./contact-main.page.scss'],
})
export class ContactMainPage implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  state: IContactMainPageState = {
    array: [],
    filterArray: [],
    search: {
      value: '',
      group: undefined
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
    // this.useSocket();
    this.useDispatch();
    this.useData();
  }
  useSocket = () => {
    this.customerService.triggerSocket().subscribe((trigger) => {
      if (trigger.type === 'create') {
        this.state.array.push(trigger.data as CustomerVM);
      } else if (trigger.type === 'update') {
        this.state.array[this.state.array.findIndex((e) => e.id === (trigger.data as CustomerVM).id)] = (trigger.data as CustomerVM);
      } else if (trigger.type === 'remove') {
        this.state.array.splice(this.state.array.findIndex((e) => e.id === (trigger.data as CustomerVM).id), 1);
      }
      this.useFilter();
    });
  }
  useLoadMine = () => {
    this.subscriptions.push(
      this.store.select(authSelector.profile)
        .pipe(
          tap((profile) => {
            this.state.you = profile;
            this.state.canAdd = this.state.you.roles.filter((role) => role.canCreateCustomer).length > 0;
            this.state.canImport = this.state.you.roles.filter((role) => role.canImportCustomer).length > 0;
            this.state.canUpdate = this.state.you.roles.filter((role) => role.canUpdateCustomer).length > 0;
            this.state.canRemove = this.state.you.roles.filter((role) => role.canRemoveCustomer).length > 0;
          })
        )
        .subscribe()
    );
  }
  useDispatch = () => {
    this.subscriptions.push(
      this.store.select(customerSelector.firstLoad)
        .pipe(
          tap((firstLoad) => {
            if (!firstLoad) {
              this.useReload();
            }
          })
        ).subscribe()
    );
  }
  useData = () => {
    this.subscriptions.push(
      this.store.select(customerSelector.customers)
        .pipe(
          tap((data) => {
            this.state.array = data;
            this.useFilter();
          })
      ).subscribe()
    );
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
        && (this.state.search.group != null
          ? e.groups.filter((group) => group.id === this.state.search.group.id).length > 0 : true)
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
    group: GroupVM
  }) => {
    console.log(search);
    this.state.search = { ...this.state.search, ...search };
    this.useFilter();
  }
  useShowSpinner = () => {
    this.spinner.show('contact-main');
  }
  useHideSpinner = () => {
    setTimeout(() => {
      this.spinner.hide('contact-main');
    }, 1000);
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
