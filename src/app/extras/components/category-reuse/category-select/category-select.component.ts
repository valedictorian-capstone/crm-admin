import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { CategoryService } from '@services';
import { CategoryAction } from '@store/actions';
import { categorySelector } from '@store/selectors';
import { State } from '@store/states';
import { CategoryVM } from '@view-models';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
interface ICategorySelectComponentState {
  search: string;
  array: CategoryVM[];
  filterArray: CategoryVM[];
  status: 'finding' | 'done';
}
@Component({
  selector: 'app-reuse-category-select',
  templateUrl: './category-select.component.html',
  styleUrls: ['./category-select.component.scss']
})
export class CategorySelectComponent implements OnInit, OnDestroy {
  @Output() useSelect: EventEmitter<CategoryVM> = new EventEmitter<CategoryVM>();
  @Input() selected: CategoryVM;
  subscriptions: Subscription[] = [];
  state: ICategorySelectComponentState = {
    search: '',
    array: [],
    filterArray: [],
    status: 'done',
  };
  constructor(
    protected readonly service: CategoryService,
    protected readonly store: Store<State>,
  ) { }
  ngOnInit() {
    this.useDispatch();
    this.useData();
  }
  useDispatch = () => {
    this.subscriptions.push(
      this.store.select(categorySelector.firstLoad)
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
      this.store.select(categorySelector.categorys)
        .pipe(
          tap((data) => {
            this.state.array = data;
            this.useSearch('');
          })
        ).subscribe()
    );
  }
  useReload = () => {
    this.state.status = 'finding';
    this.store.dispatch(CategoryAction.FindAllAction({
      finalize: () => {
        this.state.status = 'done';
      }
    }));
  }
  useSearch = (search: string) => {
    this.state.search = search;
    this.state.filterArray = this.state.array.filter((category) => category.name.toLowerCase().includes(search.toLowerCase()));
  }
  usePlus = () => {
    this.subscriptions.push(
      this.service.insert({ name: this.state.search })
        .pipe(
          tap((data) => {
            this.state.array.push(data);
            this.useSelect.emit(data);
            this.useSearch('');
          })
        ).subscribe()
    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
