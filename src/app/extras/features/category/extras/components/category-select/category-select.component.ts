import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { CategoryAction } from '@store/actions';
import { State } from '@store/states';
import { CategoryVM } from '@view-models';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
interface ICategorySelectComponentState {
  search: string;
  array: CategoryVM[];
  filterArray: CategoryVM[];
  status: 'finding' | 'done';
}
@Component({
  selector: 'app-category-select',
  templateUrl: './category-select.component.html',
  styleUrls: ['./category-select.component.scss']
})
export class CategorySelect1Component implements OnInit, OnDestroy {
  @Input() modelChange: EventEmitter<CategoryVM> = new EventEmitter<CategoryVM>();
  @Input() control: FormControl;
  @Input() model: CategoryVM;
  subscriptions: Subscription[] = [];
  state: ICategorySelectComponentState = {
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
    const subscription = this.store.select((state) => state.category)
      .pipe(
        tap((category) => {
          const firstLoad = category.firstLoad;
          const data = (category.ids as string[]).map((id) => category.entities[id]);
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
    this.store.dispatch(CategoryAction.FindAllAction({
      finalize: () => {
        this.useHideSpinner();
      }
    }));
  }
  useSearch = () => {
    this.state.filterArray = this.state.array.filter((category) => category.name.toLowerCase().includes(this.state.search.toLowerCase()));
  }
  useShowSpinner = () => {
    this.spinner.show('category-select');
  }
  useHideSpinner = () => {
    this.spinner.hide('category-select');
  }
  useSelectItem(item: CategoryVM) {
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
