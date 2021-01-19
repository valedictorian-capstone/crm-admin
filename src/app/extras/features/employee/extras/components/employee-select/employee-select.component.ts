import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { AccountAction } from '@store/actions';
import { State } from '@store/states';
import { AccountVM } from '@view-models';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
interface IEmployeeSelectComponentState {
  search: string;
  array: AccountVM[];
  filterArray: AccountVM[];
  status: 'finding' | 'done';
}
@Component({
  selector: 'app-employee-select',
  templateUrl: './employee-select.component.html',
  styleUrls: ['./employee-select.component.scss']
})
export class EmployeeSelect1Component implements OnInit, OnDestroy {
  @Input() modelChange: EventEmitter<AccountVM> = new EventEmitter<AccountVM>();
  @Input() control: FormControl;
  @Input() model: AccountVM;
  subscriptions: Subscription[] = [];
  state: IEmployeeSelectComponentState = {
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
    const subscription = this.store.select((state) => state.account)
      .pipe(
        tap((employee) => {
          const firstLoad = employee.firstLoad;
          const data = (employee.ids as string[]).map((id) => employee.entities[id]);
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
    this.store.dispatch(AccountAction.FindAllAction({
      finalize: () => {
        this.useHideSpinner();
      }
    }));
  }
  useSearch = () => {
    this.state.filterArray = this.state.array.filter((employee) => employee.fullname.toLowerCase().includes(this.state.search.toLowerCase()));
  }
  useShowSpinner = () => {
    this.spinner.show('employee-select');
  }
  useHideSpinner = () => {
    this.spinner.hide('employee-select');
  }
  useSelectItem(item: AccountVM) {
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
