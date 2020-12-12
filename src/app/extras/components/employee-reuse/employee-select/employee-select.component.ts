import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from '@services';
import { AccountVM } from '@view-models';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { authSelector, accountSelector } from '@store/selectors';
import { Store } from '@ngrx/store';
import { State } from '@store/states';
import { AccountAction } from '@store/actions';

interface IEmployeeSelectComponentState {
  search: string;
  array: AccountVM[];
  filterArray: AccountVM[]
  status: 'finding' | 'done';
  you: AccountVM;
}
@Component({
  selector: 'app-reuse-employee-select',
  templateUrl: './employee-select.component.html',
  styleUrls: ['./employee-select.component.scss']
})
export class EmployeeSelectComponent implements OnInit, OnDestroy {
  @Output() useSelect: EventEmitter<AccountVM> = new EventEmitter<AccountVM>();
  @Output() useNone: EventEmitter<string> = new EventEmitter<string>();
  @Input() selected: AccountVM;
  subscriptions: Subscription[] = [];
  state: IEmployeeSelectComponentState = {
    search: '',
    array: [],
    filterArray: [],
    status: 'done',
    you: undefined
  }
  constructor(
    protected readonly service: AccountService,
    protected readonly activatedRoute: ActivatedRoute,
    protected readonly store: Store<State>
  ) {
    this.useLoadMine();
  }
  ngOnInit() {
    this.useDispatch();
    this.useData();
  }
  useDispatch = () => {
    this.subscriptions.push(
      this.store.select(accountSelector.firstLoad)
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
      this.store.select(accountSelector.accounts)
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
    this.store.dispatch(AccountAction.FindAllAction({
      finalize: () => {
        this.state.status = 'done';
      }
    }));
  }
  useLoadMine = () => {
    this.subscriptions.push(
      this.store.select(authSelector.profile)
        .pipe(
          tap((profile) => {
            this.state.you = profile;
          })
        )
        .subscribe()
    );
  }
  useSearch = (value: string) => {
    this.state.search = value;
    this.state.filterArray = this.state.array.filter((account) => account.fullname.toLowerCase().includes(value.toLowerCase()));
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
