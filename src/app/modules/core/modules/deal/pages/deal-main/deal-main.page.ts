import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DealService, GlobalService } from '@services';
import { AccountVM, DealVM, CustomerVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { State } from '@store/states';
import { authSelector, dealSelector } from '@store/selectors';
import { Subscription } from 'rxjs';
import { DealAction } from '@store/actions';
interface IDealMainPageState {
  you: AccountVM;
  array: DealVM[];
  filterArray: DealVM[];
  search: {
    status: string,
    range: {start: Date, end: Date},
    name: string,
    customer: CustomerVM,
    assignees: AccountVM[],
  };
  canAdd: boolean;
  canUpdate: boolean;
  canAssign: boolean;
  canRemove: boolean;
}
@Component({
  selector: 'app-deal-main',
  templateUrl: './deal-main.page.html',
  styleUrls: ['./deal-main.page.scss']
})
export class DealMainPage implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  state: IDealMainPageState = {
    you: undefined,
    array: [],
    filterArray: [],
    search: {
      assignees: [],
      customer: undefined,
      status: '',
      name: '',
      range: undefined
    },
    canUpdate: false,
    canAssign: false,
    canAdd: false,
    canRemove: false
  }
  constructor(
    protected readonly service: DealService,
    protected readonly router: Router,
    protected readonly globalService: GlobalService,
    protected readonly spinner: NgxSpinnerService,
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
      this.store.select(dealSelector.firstLoad)
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
      this.store.select(dealSelector.deals)
        .pipe(
          tap((data) => {
            this.state.array = data;
            this.useFilter();
          })
        ).subscribe());
  }
  useReload = () => {
    this.useShowSpinner();
    this.store.dispatch(DealAction.FindAllAction({
      finalize: () => {
        this.useHideSpinner();
      }
    }));
  }
  useLoadMine = () => {
    this.subscriptions.push(
      this.store.select(authSelector.profile)
      .pipe(
        tap((profile) => {
          this.state.you = profile;
          this.state.canAdd = this.state.you.roles.filter((role) => role.canCreateDeal).length > 0;
          this.state.canUpdate = this.state.you.roles.filter((role) => role.canUpdateDeal).length > 0;
          this.state.canRemove = this.state.you.roles.filter((role) => role.canRemoveDeal).length > 0;
          this.state.canAssign = this.state.you.roles.filter((role) => role.canAssignDeal).length > 0;
        })
      )
      .subscribe()
    )
  }
  usePlus = () => {
    this.globalService.triggerView$.next({ type: 'deal', payload: {} });
  }
  useShowSpinner = () => {
    this.spinner.show('deal-main');
  }
  useHideSpinner = () => {
    setTimeout(() => {
      this.spinner.hide('deal-main');
    }, 1000);
  }
  useViewPipeline = () => {
    this.router.navigate(['core/process/detail']);
  }
  useSearch = (search: {
    status: string,
    range: {start: Date, end: Date},
    name: string,
    customer: CustomerVM,
    assignees: [],
  }) => {
    this.state.search = { ...this.state.search, ...search };
    this.useFilter();
  }
  useFilter = () => {
    this.state.filterArray = this.state.array.filter((deal) => deal.status.includes(this.state.search.status));
    this.state.filterArray = this.state.array.filter((deal) =>
      (deal.status.includes(this.state.search.status)) &&
      (deal.title.toLowerCase().includes(this.state.search.name.toLowerCase())) &&
      (this.state.search.range?.start ? new Date(deal.createdAt).getTime() >= new Date(this.state.search.range.start).getTime() : true) &&
      (this.state.search.range?.end ? new Date(deal.createdAt).getTime() <= new Date(this.state.search.range.end).getTime() : true) &&
      (this.state.search.customer ? deal.customer.id === this.state.search.customer.id : true) &&
      (this.state.search.assignees.length > 0
        ? (this.state.search.assignees.findIndex((assingee) => assingee.id === deal.assignee?.id) > -1) : true)
    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
