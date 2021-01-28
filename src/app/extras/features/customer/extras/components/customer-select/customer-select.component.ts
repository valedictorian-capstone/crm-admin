import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { CustomerAction } from '@store/actions';
import { State } from '@store/states';
import { CustomerVM } from '@view-models';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
interface ICustomerSelectComponentState {
  search: string;
  array: CustomerVM[];
  filterArray: CustomerVM[];
  status: 'finding' | 'done';
}
@Component({
  selector: 'app-customer-select',
  templateUrl: './customer-select.component.html',
  styleUrls: ['./customer-select.component.scss']
})
export class CustomerSelect1Component implements OnInit, OnDestroy {
  @Output() modelChange: EventEmitter<CustomerVM> = new EventEmitter<CustomerVM>();
  @Input() control: FormControl;
  @Input() model: CustomerVM;
  subscriptions: Subscription[] = [];
  state: ICustomerSelectComponentState = {
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
    const subscription = this.store.select((state) => state.customer)
      .pipe(
        tap((customer) => {
          const firstLoad = customer.firstLoad;
          const data = (customer.ids as string[]).map((id) => customer.entities[id]);
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
    this.store.dispatch(CustomerAction.FindAllAction({
      finalize: () => {
        this.useHideSpinner();
      }
    }));
  }
  useSearch = () => {
    this.state.filterArray = this.state.array.filter((customer) => customer.fullname.toLowerCase().includes(this.state.search.toLowerCase()));
  }
  useShowSpinner = () => {
    this.spinner.show('customer-select');
  }
  useHideSpinner = () => {
    this.spinner.hide('customer-select');
  }
  useSelectItem(item: CustomerVM) {
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
