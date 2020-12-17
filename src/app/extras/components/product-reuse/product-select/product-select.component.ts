import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { ProductService } from '@services';
import { ProductAction } from '@store/actions';
import { productSelector } from '@store/selectors';
import { State } from '@store/states';
import { ProductVM } from '@view-models';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

interface IProductSelectComponentState {
  search: string;
  array: ProductVM[];
  filterArray: ProductVM[];
  status: 'finding' | 'done';
}
@Component({
  selector: 'app-reuse-product-select',
  templateUrl: './product-select.component.html',
  styleUrls: ['./product-select.component.scss']
})
export class ProductSelectComponent implements OnInit, OnDestroy {
  @Output() useSelect: EventEmitter<ProductVM> = new EventEmitter<ProductVM>();
  @Output() useAdd: EventEmitter<string> = new EventEmitter<string>();
  @Input() selected: ProductVM;
  subscriptions: Subscription[] = [];
  state: IProductSelectComponentState = {
    search: '',
    array: [],
    filterArray: [],
    status: 'done',
  }
  constructor(
    protected readonly store: Store<State>
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
            this.useSearch('');
          }
        })
      ).subscribe();
    this.subscriptions.push(subscription);
  }
  useReload = () => {
    this.state.status = 'finding';
    this.store.dispatch(ProductAction.FindAllAction({
      finalize: () => {
        this.state.status = 'done';
      }
    }));
  }
  useSearch = (value: string) => {
    this.state.search = value;
    this.state.filterArray = this.state.array.filter((product) => product.name.toLowerCase().includes(value.toLowerCase()));
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
