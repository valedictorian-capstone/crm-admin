import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { CustomerService, GlobalService } from '@services';
import { CustomerAction } from '@store/actions';
import { authSelector, customerSelector } from '@store/selectors';
import { State } from '@store/states';
import { AccountVM, CustomerVM, GroupVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription, of } from 'rxjs';
import { tap, catchError, finalize } from 'rxjs/operators';
import * as XLSX from 'xlsx';
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
    protected readonly toastrService: NbToastrService,
    protected readonly store: Store<State>
  ) {
    this.useLoadMine();
  }

  ngOnInit() {
    // this.useSocket();
    this.useDispatch();
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
    const subscription = this.store.select(authSelector.profile)
      .pipe(
        tap((profile) => {
          if (profile) {
            this.state.you = profile;
            this.state.canAdd = this.state.you.roles.filter((role) => role.canCreateCustomer).length > 0;
            this.state.canImport = this.state.you.roles.filter((role) => role.canImportCustomer).length > 0;
            this.state.canUpdate = this.state.you.roles.filter((role) => role.canUpdateCustomer).length > 0;
            this.state.canRemove = this.state.you.roles.filter((role) => role.canRemoveCustomer).length > 0;
          }
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
            this.state.array = data;
            this.useFilter();
          }
        })
      ).subscribe();
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
      && (this.state.search.group != null
        ? e.groups.filter((group) => group.id === this.state.search.group.id).length > 0 : true)
    );
  }
  useExport = (table: ElementRef<any>) => {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);
    ws['!cols'] = [{ width: 40 }, { width: 40 }, { width: 40 }, { width: 40 }, { width: 40 }, { width: 40 }, { width: 40 }, { width: 40 }, { width: 40 }, { width: 40 }, { width: 40 }, { width: 40 }, { width: 40 }, { width: 40 }, { width: 40 }, { width: 40 }, { width: 40 }, { width: 40 }, { width: 40 }, { width: 40 }, { width: 40 }, { width: 40 }, { width: 40 }];
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Customer Export');
    XLSX.writeFile(wb, 'customer-export-' + new Date().getTime() + '.xlsx');
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
    this.state.search = { ...this.state.search, ...search };
    this.useFilter();
  }
  useToggleState = (customer: CustomerVM) => {
    this.useShowSpinner();
    const message = `${customer.isDelete ? 'Active' : 'Disabled'} ${customer.fullname} `;
    const subscription = (!customer.isDelete
      ? this.customerService.disabled(customer.id)
      : this.customerService.restore(customer.id))
      .pipe(
        tap((data) => {
          this.toastrService.success('', message + 'successful', { duration: 3000 });
        }),
        catchError((err) => {
          this.toastrService.danger('', message + 'fail! ' + err.message, { duration: 3000 });
          return of(undefined);
        }),
        finalize(() => {
          this.useHideSpinner();
        })
      )
      .subscribe();
    this.subscriptions.push(subscription);
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
