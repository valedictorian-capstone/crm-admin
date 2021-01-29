import { ICustomerSearch, ICustomerMainState } from '@extras/features/customer';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ISort } from '@extras/interfaces';
import { Store } from '@ngrx/store';
import { CustomerService } from '@services';
import { State } from '@states';
import { authSelector } from '@selectors';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { CustomerAction } from '@store/actions';
import { FormControl } from '@angular/forms';
import { CustomerVM, CampaignVM } from '@view-models';

@Component({
  selector: 'app-customer-main',
  templateUrl: './customer-main.container.html',
  styleUrls: ['./customer-main.container.scss']
})
export class CustomerMainContainer implements OnInit, OnDestroy {
  @Input() query: {
    id: string;
    name: string;
    icon: string;
    pack: string;
  };
  @Input() isMain: boolean;
  @Input() campaign: CampaignVM;
  state: ICustomerMainState = {
    array: [],
    filterArray: [],
    paginationArray: [],
    active: new FormControl(1),
    pageCount: 20,
    show: true,
    type: 'datatable',
  }
  search: ICustomerSearch = {
    value: '',
    genders: [],
    groups: [],
    totalDeal: {
      from: undefined,
      to: undefined,
    },
    totalSpending: {
      from: undefined,
      to: undefined,
    },
    frequency: {
      from: undefined,
      to: undefined,
    },
    birthDay: undefined,
    city: undefined,
    country: undefined,
    twitter: undefined,
    facebook: undefined,
    skypeName: undefined,
    state: undefined,
    street: undefined,
  }
  sort: ISort = {
    key: undefined,
    stage: 'up',
  };
  subscriptions: Subscription[] = [];
  checkList: { formControl: FormControl, customer: CustomerVM }[] = [];
  constructor(
    protected readonly service: CustomerService,
    protected readonly spinner: NgxSpinnerService,
    protected readonly store: Store<State>
  ) {
    this.useLoadMine();
  }
  ngOnInit() {
    this.useDispatch();
  }
  useLoadMine() {
    this.subscriptions.push(
      this.store.select(authSelector.profile)
        .pipe(
          tap((profile) => {
            if (profile) {
              this.state.you = profile;
              this.state.canAdd = this.state.you.roles.filter((role) => role.canCreateCustomer).length > 0;
              this.state.canUpdate = this.state.you.roles.filter((role) => role.canUpdateCustomer).length > 0;
              this.state.canImport = this.state.you.roles.filter((role) => role.canImportCustomer).length > 0;
            }
          })
        )
        .subscribe()
    );
  }
  useDispatch() {
    this.subscriptions.push(
      this.store.select((state) => state.customer)
        .pipe(
          tap((data) => {
            const firstLoad = data.firstLoad;
            let rs = (data.ids as string[]).map((id) => data.entities[id]);
            if (this.query) {
              rs = rs.filter((e) => e.groups.find((role) => role.id === this.query.id));
            }
            if (firstLoad || this.state.firstLoad) {
              this.state.array = rs;
              this.useFilter();
            } else {
              this.useReload();
            }
          }),
        ).subscribe()
    );
  }
  useReload() {
    this.useShowSpinner();
    if (this.isMain) {
      this.store.dispatch(CustomerAction.FindAllAction({
        finalize: () => {
          this.useHideSpinner();
        }
      }));
    } else {
      this.service.query(this.query)
        .pipe(
          tap((res) => this.store.dispatch(CustomerAction.ListAction({ res }))),
          finalize(() => {
            this.state.firstLoad = true;
            this.useHideSpinner();
          })
        )
        .subscribe()
    }
  }
  useFilter = () => {
    this.state.filterArray = this.state.array.filter((e) =>
      (this.search.value ? (e.fullname.toLowerCase().includes(this.search.value.toLowerCase()) || e.email.toLowerCase().includes(this.search.value.toLowerCase()) || e.phone.toLowerCase().includes(this.search.value.toLowerCase())) : true)
      && (this.search.genders.length > 0 ? this.search.genders.includes(e.gender) : true)
      && (this.search.skypeName ? e.skypeName.toLowerCase().includes(this.search.skypeName.toLowerCase()) : true)
      && (this.search.facebook ? e.facebook.toLowerCase().includes(this.search.facebook.toLowerCase()) : true)
      && (this.search.twitter ? e.twitter.toLowerCase().includes(this.search.twitter.toLowerCase()) : true)
      && (this.search.street ? e.street.toLowerCase().includes(this.search.street.toLowerCase()) : true)
      && (this.search.city ? e.city.toLowerCase().includes(this.search.city.toLowerCase()) : true)
      && (this.search.state ? e.state.toLowerCase().includes(this.search.state.toLowerCase()) : true)
      && (this.search.country ? e.country.toLowerCase().includes(this.search.country.toLowerCase()) : true)
      && (this.search.totalDeal ? ((this.search.totalDeal.from ? parseInt(this.search.totalDeal.from + '') <= e.totalDeal : true) && (this.search.totalDeal.to ? parseInt(this.search.totalDeal.to + '') >= e.totalDeal : true)) : true)
      && (this.search.totalSpending ? ((this.search.totalSpending.from ? parseInt(this.search.totalSpending.from + '') <= e.totalSpending : true) && (this.search.totalSpending.to ? parseInt(this.search.totalSpending.to + '') >= e.totalSpending : true)) : true)
      && (this.search.frequency ? ((this.search.frequency.from ? this.search.frequency.from <= e.frequency : true) && (this.search.frequency.to ? this.search.frequency.to >= e.frequency : true)) : true)
      && (this.search.groups.length > 0 ? e.groups.filter((group) => this.search.groups.filter((g) => g.id === group.id).length > 0).length > 0 : true)
      && (this.search.birthDay
        ? (
          (this.search.birthDay.start ? (e.birthDay && new Date(e.birthDay).getTime() >= new Date(this.search.birthDay.start).getTime()) : true)
          &&
          (this.search.birthDay.end ? (e.birthDay && new Date(e.birthDay).getTime() <= new Date(this.search.birthDay.end).getTime()) : true))
        : true)
    );
    this.useCalculateMax();
    this.state.active.setValue(1);
    this.useSort();
  }
  useCalculateMax() {
    if (this.state.filterArray.length > this.state.pageCount) {
      this.state.max = Math.floor(this.state.filterArray.length / this.state.pageCount) + (this.state.filterArray.length % this.state.pageCount > 0 ? 1 : 0);
    } else {
      this.state.max = 1;
    }
  }
  usePagination = () => {
    this.state.paginationArray = this.state.filterArray.filter((e, i) => {
      i = i + 1;
      const page = this.state.active.value * this.state.pageCount;
      return i >= page - (this.state.pageCount - 1) && i <= page;
    })
    this.state = { ...this.state };
  }
  useCheck(checkList: { formControl: FormControl, customer: CustomerVM }[]) {
    this.checkList = checkList;
  }
  useSearch = (search: ICustomerSearch) => {
    this.search = search;
    console.log(this.search);
    this.useFilter();
  }
  useSort = () => {
    if (this.sort.key) {
      this.state.filterArray.sort((a, b) => a[this.sort.key] < b[this.sort.key] ? (this.sort.stage === 'down' ? -1 : 1) : (this.sort.stage === 'down' ? 1 : -1));
    }
    this.usePagination();

  }
  useShowSpinner = () => {
    this.spinner.show('customer-main');
  }
  useHideSpinner = () => {
    this.spinner.hide('customer-main');
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
