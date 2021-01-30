import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IProductMainState, IProductSearch } from '@extras/features/product';
import { ISort } from '@extras/interfaces';
import { Store } from '@ngrx/store';
import { authSelector } from '@selectors';
import { ProductService } from '@services';
import { State } from '@states';
import { ProductAction } from '@store/actions';
import { ProductVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-product-main',
  templateUrl: './product-main.container.html',
  styleUrls: ['./product-main.container.scss']
})
export class ProductMainContainer implements OnInit {
  state: IProductMainState = {
    array: [],
    filterArray: [],
    paginationArray: [],
    active: new FormControl(1),
    pageCount: 20,
    show: true,
    type: 'datatable',
  }
  search: IProductSearch = {
    name: '',
  }
  sort: ISort = {
    key: undefined,
    stage: 'up',
  };
  checkList: { formControl: FormControl, product: ProductVM }[] = [];
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly service: ProductService,
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
              this.state.canAdd = profile.roles.filter((role) => role.canCreateProduct).length > 0;
              this.state.canUpdate = profile.roles.filter((role) => role.canUpdateProduct).length > 0;
              this.state.canRemove = profile.roles.filter((role) => role.canRemoveProduct).length > 0;
              this.state.canImport = profile.roles.filter((role) => role.canImportProduct).length > 0;
            }
          })
        )
        .subscribe()
    );
  }
  useDispatch() {
    this.subscriptions.push(
      this.store.select((state) => state.product)
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
    this.store.dispatch(ProductAction.FindAllAction({
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
  useSearch = (search: IProductSearch) => {
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
    this.spinner.show('product-main');
  }
  useCheck(checkList: {formControl: FormControl, product: ProductVM}[]) {
    this.checkList = checkList;
    console.log(this.checkList);
  }
  useHideSpinner = () => {
    this.spinner.hide('product-main');
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
