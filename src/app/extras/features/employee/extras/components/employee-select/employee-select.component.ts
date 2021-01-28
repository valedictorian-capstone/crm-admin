import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { AccountAction } from '@store/actions';
import { State } from '@store/states';
import { AccountVM } from '@view-models';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { authSelector } from '@store/selectors';
interface IEmployeeSelectComponentState {
  search: string;
  you: AccountVM;
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
  @Output() modelChange: EventEmitter<AccountVM> = new EventEmitter<AccountVM>();
  @Input() type: 'assignee' | 'feedbackAssignee' | 'all' = 'all';
  @Input() control: FormControl;
  @Input() model: AccountVM;
  @Input() showYou: boolean;
  @Input() showNone: boolean;
  subscriptions: Subscription[] = [];
  state: IEmployeeSelectComponentState = {
    search: '',
    array: [],
    you: undefined,
    filterArray: [],
    status: 'done',
  }
  constructor(
    protected readonly store: Store<State>,
    protected readonly spinner: NgxSpinnerService,
  ) {
    this.useLoadMine();
  }

  ngOnInit() {
    this.useDispatch();
  }
  useLoadMine = () => {
    const subscription = this.store.select(authSelector.profile)
      .pipe(
        tap((profile) => {
          if (profile) {
            this.state.you = profile;
          }
        })
      )
      .subscribe();
    this.subscriptions.push(subscription);
  }
  useDispatch = () => {
    const subscription = this.store.select((state) => state.account)
      .pipe(
        tap((employee) => {
          const firstLoad = employee.firstLoad;
          const data = (employee.ids as string[]).map((id) => employee.entities[id]).map((e) => ({
            ...e,
            canGetAssignDeal: e.roles.filter((role) => role.canGetAssignDeal).length > 0,
            canGetFeedbackDeal: e.roles.filter((role) => role.canGetFeedbackDeal).length > 0,
            won: e.deals.filter((deal) => deal.status === 'won').length,
            lost: e.deals.filter((deal) => deal.status === 'lost').length,
            processing: e.deals.filter((deal) => deal.status === 'processing').length,
          })).filter((e) => this.showYou ? true : e.id !== this.state.you.id);
          if (!firstLoad) {
            this.useReload();
          } else {
            switch (this.type) {
              case 'all':
                this.state.array = data;
                break;
              case 'assignee':
                this.state.array = data.filter((e) => e['canGetAssignDeal']);
                break;
              case 'feedbackAssignee':
                this.state.array = data.filter((e) => e['canGetFeedbackDeal']);
                break;
              default:
                this.state.array = [];
                break;
            }
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
