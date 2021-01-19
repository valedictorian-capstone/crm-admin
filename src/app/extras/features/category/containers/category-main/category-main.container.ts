import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ICategoryMainState, ICategorySearch } from '@extras/features/category';
import { ISort } from '@extras/interfaces';
import { Store } from '@ngrx/store';
import { authSelector } from '@selectors';
import { CategoryService } from '@services';
import { State } from '@states';
import { CategoryAction } from '@store/actions';
import { CategoryVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
@Component({
  selector: 'app-category-main',
  templateUrl: './category-main.container.html',
  styleUrls: ['./category-main.container.scss']
})
export class CategoryMainContainer implements OnInit {
  state: ICategoryMainState = {
    array: [],
    filterArray: [],
    paginationArray: [],
    active: new FormControl(1),
    pageCount: 20,
    show: true,
    type: 'datatable',
  }
  search: ICategorySearch = {
    name: '',
  }
  sort: ISort = {
    key: undefined,
    stage: 'up',
  };
  checkList: { formControl: FormControl, category: CategoryVM }[] = [];
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly service: CategoryService,
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
              this.state.canAdd = profile.roles.filter((role) => role.canCreateDeal).length > 0;
              this.state.canUpdate = profile.roles.filter((role) => role.canUpdateDeal).length > 0;
              this.state.canRemove = profile.roles.filter((role) => role.canRemoveDeal).length > 0;
            }
          })
        )
        .subscribe()
    );
  }
  useDispatch() {
    this.subscriptions.push(
      this.store.select((state) => state.category)
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
    this.store.dispatch(CategoryAction.FindAllAction({
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
  useSearch = (search: ICategorySearch) => {
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
    this.spinner.show('category-main');
  }
  useCheck(checkList: {formControl: FormControl, category: CategoryVM}[]) {
    this.checkList = checkList;
  }
  useHideSpinner = () => {
    this.spinner.hide('category-main');
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
