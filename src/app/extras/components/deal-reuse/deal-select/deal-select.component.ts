import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { DealAction } from '@store/actions';
import { dealSelector } from '@store/selectors';
import { State } from '@store/states';
import { DealVM } from '@view-models';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
interface IDealSelectComponentState {
  search: string;
  array: DealVM[];
  filterArray: DealVM[];
  status: 'finding' | 'done';
}
@Component({
  selector: 'app-reuse-deal-select',
  templateUrl: './deal-select.component.html',
  styleUrls: ['./deal-select.component.scss']
})
export class DealSelectComponent implements OnInit, OnDestroy {
  @Output() useSelect: EventEmitter<DealVM> = new EventEmitter<DealVM>();
  @Output() useAdd: EventEmitter<string> = new EventEmitter<string>();
  @Input() selected: DealVM;
  @Input() forSearch = false;
  subscriptions: Subscription[] = [];
  state: IDealSelectComponentState = {
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
    const subscription = this.store.select((state) => state.deal)
      .pipe(
        tap((deal) => {
          const firstLoad = deal.firstLoad;
          const data = (deal.ids as string[]).map((id) => deal.entities[id]);
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
    this.store.dispatch(DealAction.FindAllAction({
      finalize: () => {
        this.state.status = 'done';
      }
    }));
  }
  useSearch = (search: string) => {
    this.state.search = search;
    this.state.filterArray = this.state.array.filter((deal) => deal.title.toLowerCase().includes(search.toLowerCase()));
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
