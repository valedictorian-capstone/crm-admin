import { Component, OnInit, EventEmitter, Output, Input, OnDestroy } from '@angular/core';
import { AccountVM } from '@view-models';
import { AccountService } from '@services';
import { tap, finalize } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '@store/states';
import { accountSelector } from '@store/selectors';
import { AccountAction } from '@store/actions';
interface IEmployeeFilterComponentState {
  search: string;
  array: AccountVM[];
  filterArray: AccountVM[];
}
@Component({
  selector: 'app-reuse-employee-filter',
  templateUrl: './employee-filter.component.html',
  styleUrls: ['./employee-filter.component.scss']
})
export class EmployeeFilterComponent implements OnInit, OnDestroy {
  @Output() useSearch: EventEmitter<AccountVM[]> = new EventEmitter<AccountVM[]>();
  @Input() selectedEmployees: AccountVM[] = [];
  subscriptions: Subscription[] = [];
  state: IEmployeeFilterComponentState = {
    search: '',
    array: [],
    filterArray: [],
  }
  constructor(
    protected readonly spinner: NgxSpinnerService,
    protected readonly store: Store<State>,

  ) { }
  ngOnInit() {
    this.useDispatch();
  }
  useDispatch = () => {
    const subscription = this.store.select((state) => state.account)
      .pipe(
        tap((account) => {
          const firstLoad = account.firstLoad;
          const data = (account.ids as string[]).map((id) => account.entities[id]);
          if (!firstLoad) {
            this.useReload();
          } else {
            this.state.array = data;
            this.useFilter();
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
  useFilter = () => {
    this.state.filterArray = this.state.array.filter((e) =>
      (e.fullname.toLowerCase().includes(this.state.search.toLowerCase()) ||
        e.phone.toLowerCase().includes(this.state.search.toLowerCase()) ||
        e.email.toLowerCase().includes(this.state.search.toLowerCase()))
    );
  }
  useShowSpinner = () => {
    this.spinner.show('employee-filter');
  }
  useHideSpinner = () => {
    this.spinner.hide('employee-filter');
  }
  useSelect = (value: boolean, employee: AccountVM) => {
    if (value) {
      this.selectedEmployees.push(employee);
    } else {
      this.selectedEmployees = this.selectedEmployees.filter((emp) => emp.id !== employee.id);
    }
    this.useSearch.emit(this.selectedEmployees);
  }
  useChecked = (employee: AccountVM) => {
    return this.selectedEmployees.findIndex((e) => e.id === employee.id) > -1;
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
