import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { ProductAction } from '@store/actions';
import { State } from '@store/states';
import { ProductVM } from '@view-models';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
interface IProductSelectComponentState {
  search: string;
  array: ProductVM[];
  filterArray: ProductVM[];
  status: 'finding' | 'done';
}
@Component({
  selector: 'app-product-select',
  templateUrl: './product-select.component.html',
  styleUrls: ['./product-select.component.scss']
})
export class ProductSelect1Component implements OnInit, OnDestroy {
  @Output() modelChange: EventEmitter<ProductVM> = new EventEmitter<ProductVM>();
  @Input() control: FormControl;
  @Input() model: ProductVM;
  subscriptions: Subscription[] = [];
  state: IProductSelectComponentState = {
    search: '',
    array: [],
    filterArray: [],
    status: 'done',
  }
  constructor(
    protected readonly store: Store<State>,
    protected readonly spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.useDispatch();
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
            this.state.array = data;
            this.useSearch();
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
  useSearch = () => {
    this.state.filterArray = this.state.array.filter((product) => product.name.toLowerCase().includes(this.state.search.toLowerCase()));
  }
  useShowSpinner = () => {
    this.spinner.show('product-select');
  }
  useHideSpinner = () => {
    this.spinner.hide('product-select');
  }
  useSelectItem(item: ProductVM) {
    if (this.control) {
      this.control.setValue(item);
    }
    this.model = item;
    this.modelChange.emit(item);
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
