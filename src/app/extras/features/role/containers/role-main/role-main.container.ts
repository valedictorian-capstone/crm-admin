import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IRoleMainState, IRoleSearch } from '@extras/features/role';
import { ISort } from '@extras/interfaces';
import { Store } from '@ngrx/store';
import { RoleService } from '@services';
import { State } from '@states';
import { RoleAction } from '@store/actions';
import { RoleVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-role-main',
  templateUrl: './role-main.container.html',
  styleUrls: ['./role-main.container.scss']
})
export class RoleMainContainer implements OnInit {
  state: IRoleMainState = {
    array: [],
    filterArray: [],
    paginationArray: [],
    active: new FormControl(1),
    pageCount: 20,
    show: true,
    type: 'datatable',
  }
  search: IRoleSearch = {
    name: '',
  }
  sort: ISort = {
    key: undefined,
    stage: 'up',
  };
  checkList: { formControl: FormControl, role: RoleVM }[] = [];
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly service: RoleService,
    protected readonly spinner: NgxSpinnerService,
    protected readonly store: Store<State>
  ) {
  }
  ngOnInit() {
    this.useDispatch();
  }
  useDispatch() {
    this.subscriptions.push(
      this.store.select((state) => state.role)
        .pipe(
          tap((data) => {
            const firstLoad = data.firstLoad;
            let rs = (data.ids as string[]).map((id) => data.entities[id]);
            if (firstLoad) {
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
    this.store.dispatch(RoleAction.FindAllAction({
      finalize: () => {
        this.useHideSpinner();
      }
    }));
  }
  useFilter = () => {
    this.state.filterArray = this.state.array.filter((e) =>
      (this.search.name ? e.name.toLowerCase().includes(this.search.name.toLowerCase()) : true)
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
    });
    this.state = { ...this.state };
  }
  useSearch = (search: IRoleSearch) => {
    this.search = search;
    this.useFilter();
  }
  useSort = () => {
    if (this.sort.key) {
      this.state.filterArray.sort((a, b) => a[this.sort.key] < b[this.sort.key] ? (this.sort.stage === 'down' ? -1 : 1) : (this.sort.stage === 'down' ? 1 : -1));
    }
    this.usePagination();

  }
  useShowSpinner = () => {
    this.spinner.show('role-main');
  }
  useCheck(checkList: {formControl: FormControl, role: RoleVM}[]) {
    this.checkList = checkList;
  }
  useHideSpinner = () => {
    this.spinner.hide('role-main');
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
