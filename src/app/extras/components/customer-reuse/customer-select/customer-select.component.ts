import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { CustomerService } from '@services';
import { CustomerAction } from '@store/actions';
import { customerSelector } from '@store/selectors';
import { State } from '@store/states';
import { CustomerVM } from '@view-models';
import { Subscription } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
interface ICustomerSelectComponentState {
  search: string;
  array: CustomerVM[];
  filterArray: CustomerVM[];
  status: 'finding' | 'done';
}
@Component({
  selector: 'app-reuse-customer-select',
  templateUrl: './customer-select.component.html',
  styleUrls: ['./customer-select.component.scss']
})
export class CustomerSelectComponent implements OnInit, OnDestroy {
  @Output() useSelect: EventEmitter<CustomerVM> = new EventEmitter<CustomerVM>();
  @Output() useAdd: EventEmitter<string> = new EventEmitter<string>();
  @Input() selected: CustomerVM;
  subscriptions: Subscription[] = [];
  state: ICustomerSelectComponentState = {
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
    this.useData();
  }
  useDispatch = () => {
    this.subscriptions.push(
      this.store.select(customerSelector.firstLoad)
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
      this.store.select(customerSelector.customers)
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
    this.store.dispatch(CustomerAction.FindAllAction({
      finalize: () => {
        this.state.status = 'done';
      }
    }));
  }
  useSearch = (search: string) => {
    this.state.search = search;
    this.state.filterArray = this.state.array.filter((customer) => customer.fullname.toLowerCase().includes(search.toLowerCase()));
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
