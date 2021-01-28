import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { DealAction } from '@store/actions';
import { State } from '@store/states';
import { DealVM } from '@view-models';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
interface IDealSelectComponentState {
  search: string;
  array: DealVM[];
  filterArray: DealVM[];
  status: 'finding' | 'done';
}

@Component({
  selector: 'app-deal-select',
  templateUrl: './deal-select.component.html',
  styleUrls: ['./deal-select.component.scss']
})
export class DealSelect1Component implements OnInit, OnDestroy {
  @Output() modelChange: EventEmitter<DealVM> = new EventEmitter<DealVM>();
  @Input() control: FormControl;
  @Input() model: DealVM;
  subscriptions: Subscription[] = [];
  state: IDealSelectComponentState = {
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
    const subscription = this.store.select((state) => state.deal)
      .pipe(
        tap((deal) => {
          const firstLoad = deal.firstLoad;
          const data = (deal.ids as string[]).map((id) => deal.entities[id]);
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
    this.store.dispatch(DealAction.FindAllAction({
      finalize: () => {
        this.useHideSpinner();
      }
    }));
  }
  useSearch = () => {
    this.state.filterArray = this.state.array.filter((deal) => deal.title.toLowerCase().includes(this.state.search.toLowerCase()));
  }
  useShowSpinner = () => {
    this.spinner.show('deal-select');
  }
  useHideSpinner = () => {
    this.spinner.hide('deal-select');
  }
  useSelectItem(item: DealVM) {
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
