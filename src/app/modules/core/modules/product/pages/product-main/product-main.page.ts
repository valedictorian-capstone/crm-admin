import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { GlobalService, ProductService } from '@services';
import { ProductAction } from '@store/actions';
import { authSelector, productSelector } from '@store/selectors';
import { State } from '@store/states';
import { AccountVM, CategoryVM, ProductVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

interface IProductMainPageState {
  array: ProductVM[];
  restores: ProductVM[];
  filterArray: ProductVM[];
  search: {
    value: '',
    category: CategoryVM,
  };
  stage: 'done' | 'finding';
  you: AccountVM;
  canAdd: boolean;
  canImport: boolean;
  canUpdate: boolean;
  canRemove: boolean;
}
@Component({
  selector: 'app-product-main',
  templateUrl: './product-main.page.html',
  styleUrls: ['./product-main.page.scss']
})
export class ProductMainPage implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  state: IProductMainPageState = {
    array: [],
    restores: [],
    filterArray: [],
    search: {
      value: '',
      category: undefined
    },
    stage: 'done',
    you: undefined,
    canAdd: false,
    canImport: false,
    canUpdate: false,
    canRemove: false,
  }
  constructor(
    protected readonly productService: ProductService,
    protected readonly globalService: GlobalService,
    protected readonly spinner: NgxSpinnerService,
    protected readonly dialogService: NbDialogService,
    protected readonly store: Store<State>
  ) {
    this.useLoadMine();
  }
  ngOnInit() {
    this.useDispatch();
  }
  useDialog(template: TemplateRef<any>) {
    this.dialogService.open(template, { closeOnBackdropClick: false });
  }
  useLoadMine = () => {
    const subscription = this.store.select(authSelector.profile)
      .pipe(
        tap((profile) => {
          if (profile) {
            this.state.you = profile;
            this.state.canAdd = this.state.you.roles.filter((role) => role.canCreateCustomer).length > 0;
            this.state.canUpdate = this.state.you.roles.filter((role) => role.canUpdateCustomer).length > 0;
            this.state.canImport = this.state.you.roles.filter((role) => role.canImportCustomer).length > 0;
            this.state.canRemove = this.state.you.roles.filter((role) => role.canRemoveCustomer).length > 0;
          }
        })
      )
      .subscribe();
    this.subscriptions.push(subscription);
  }
  useDispatch = () => {
    const subscription = this.store.select((state) => state.product)
      .pipe(
        tap((product) => {
          const firstLoad = product.firstLoad;
          const data = (product.ids as string[]).map((id) => product.entities[id]);
          if (!firstLoad) {
            this.useReload();
          } else {
            this.state.array = data.filter((product) => !product.isDelete);
            this.state.restores = data.filter((product) => product.isDelete);
            this.useFilter();
          }
        })
      ).subscribe();
    this.subscriptions.push(subscription);
  }
  useReload = () => {
    this.useShowSpinner();
    this.store.dispatch(ProductAction.FindAllAction({
      finalize: () => {
        this.useHideSpinner();
      }
    }));
  }
  useFilter = () => {
    this.state.filterArray = this.state.array.filter((e) =>
      (e.name.toLowerCase().includes(this.state.search.value.toLowerCase()) ||
        e.code.toLowerCase().includes(this.state.search.value.toLowerCase()))
      && (this.state.search.category ? (e.category.id === this.state.search.category.id) : true)
    );
  }
  usePlus = () => {
    this.globalService.triggerView$.next({ type: 'product', payload: {} });
  }
  useImport = () => {
    this.globalService.triggerView$.next({ type: 'import', payload: { importType: 'product' } });
  }
  useShowSpinner = () => {
    this.spinner.show('product-main');
  }
  useHideSpinner = () => {
    setTimeout(() => {
      this.spinner.hide('product-main');
    }, 1000);
  }
  useSearch = (search: {
    value: '',
    category: CategoryVM,
  }) => {
    this.state.search = { ...this.state.search, ...search };
    this.useFilter();
  }
  useRestore = (p: ProductVM) => {
    this.state.array.push(p);
    this.state.restores = this.state.restores.filter((product) => product.id !== p.id);
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
