import { IEmployeeSearch, IEmployeeMainState } from '@extras/features/employee';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ISort } from '@extras/interfaces';
import { Store } from '@ngrx/store';
import { AccountService } from '@services';
import { State } from '@states';
import { authSelector } from '@selectors';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { AccountAction } from '@store/actions';
import { FormControl } from '@angular/forms';
import { AccountVM } from '@view-models';

@Component({
  selector: 'app-employee-main',
  templateUrl: './employee-main.container.html',
  styleUrls: ['./employee-main.container.scss']
})
export class EmployeeMainContainer implements OnInit, OnDestroy {
  @Input() query: {
    id: string;
  };
  @Input() isMain: boolean;
  state: IEmployeeMainState = {
    array: [],
    filterArray: [],
    paginationArray: [],
    active: new FormControl(1),
    pageCount: 20,
    show: true,
    type: 'datatable',
    canAdd: true,
    canUpdate: true,
    canRemove: true,
  }
  search: IEmployeeSearch = {
    value: '',
  }
  sort: ISort = {
    key: undefined,
    stage: 'up',
  };
  subscriptions: Subscription[] = [];
  checkList: { formControl: FormControl, account: AccountVM }[] = [];
  constructor(
    protected readonly service: AccountService,
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
            }
          })
        )
        .subscribe()
    );
  }
  useDispatch() {
    this.subscriptions.push(
      this.store.select((state) => state.account)
        .pipe(
          tap((data) => {
            const firstLoad = data.firstLoad;
            let rs = (data.ids as string[]).map((id) => data.entities[id]);
            if (this.query) {
              rs = rs.filter((e) => e.roles.find((role) => role.id === this.query.id));
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
      this.store.dispatch(AccountAction.FindAllAction({
        finalize: () => {
          this.useHideSpinner();
        }
      }));
    } else {
      this.service.query(this.query)
        .pipe(
          tap((res) => this.store.dispatch(AccountAction.ListAction({ res }))),
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
      (this.search.value ? (e.fullname.toLowerCase().includes(this.search.value.toLowerCase()) || e.email.toLowerCase().includes(this.search.value.toLowerCase()) || e.phone.toLowerCase().includes(this.search.value.toLowerCase()) || e.code.toLowerCase().includes(this.search.value.toLowerCase())) : true)
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
  useCheck(checkList: { formControl: FormControl, account: AccountVM }[]) {
    this.checkList = checkList;
  }
  useSearch = (search: IEmployeeSearch) => {
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
    this.spinner.show('employee-main');
  }
  useHideSpinner = () => {
    this.spinner.hide('employee-main');
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
