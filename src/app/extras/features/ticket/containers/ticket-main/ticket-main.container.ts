import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ITicketMainState, ITicketSearch } from '@extras/features/ticket';
import { ISort } from '@extras/interfaces';
import { Store } from '@ngrx/store';
import { authSelector } from '@selectors';
import { TicketService } from '@services';
import { State } from '@states';
import { TicketAction } from '@store/actions';
import { TicketVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-ticket-main',
  templateUrl: './ticket-main.container.html',
  styleUrls: ['./ticket-main.container.scss']
})
export class TicketMainContainer implements OnInit {
  state: ITicketMainState = {
    array: [],
    filterArray: [],
    paginationArray: [],
    active: new FormControl(1),
    pageCount: 20,
    show: true,
    type: 'datatable',
  }
  search: ITicketSearch = {
    assignee: undefined,
    feedbackAssignee: undefined,
    customer: undefined,
    statuss: [],
    feedbackStatuss: [],
    types: [],
    range: undefined,
  }
  sort: ISort = {
    key: undefined,
    stage: 'up',
  };
  checkList: { formControl: FormControl, ticket: TicketVM }[] = [];
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly service: TicketService,
    protected readonly spinner: NgxSpinnerService,
    protected readonly store: Store<State>
  ) {
    this.useLoadMine();
  }
  ngOnInit() {
    this.useDispatch();
  }
  useLoadMine() {
    this.subscriptions.push(
      this.store.select(authSelector.profile)
        .pipe(
          tap((profile) => {
            if (profile) {
              this.state.canAdd = profile.roles.filter((role) => role.canCreateDeal).length > 0;
              this.state.canUpdate = profile.roles.filter((role) => role.canUpdateDeal).length > 0;
              this.state.canRemove = profile.roles.filter((role) => role.canRemoveDeal).length > 0;
            }
          })
        )
        .subscribe()
    );
  }
  useDispatch() {
    this.subscriptions.push(
      this.store.select((state) => state.ticket)
        .pipe(
          tap((data) => {
            const firstLoad = data.firstLoad;
            let rs = (data.ids as string[]).map((id) => data.entities[id]);
            if (firstLoad) {
              this.state.array = rs;
              this.useFilter();
            } else {
              this.useReload();
            }
          }),
        ).subscribe()
    );
  }
  useReload() {
    this.useShowSpinner();
    this.store.dispatch(TicketAction.FindAllAction({
      finalize: () => {
        this.useHideSpinner();
      }
    }));
  }
  useFilter = () => {
    this.state.filterArray = this.state.array.filter((e) =>
      (this.search.assignee ? e.assignee?.id === this.search.assignee.id : true)
      && (this.search.feedbackAssignee ? e.feedbackAssignee?.id === this.search.feedbackAssignee.id : true)
      && (this.search.customer ? e.customer?.id === this.search.customer.id : true)
      && (this.search.types.length > 0 ? this.search.types.includes(e.type) : true)
      && (this.search.statuss.length > 0 ? this.search.statuss.includes(e.status) : true)
      && (this.search.feedbackStatuss.length > 0 ? this.search.feedbackStatuss.includes(e.feedbackStatus) : true)
      && (this.search.range
        ? (
          (this.search.range.start ? (e.updatedAt && new Date(e.updatedAt).getTime() >= new Date(this.search.range.start).getTime()) : true)
          &&
          (this.search.range.end ? (e.updatedAt && new Date(e.updatedAt).getTime() <= new Date(this.search.range.end).getTime()) : true))
        : true)
    );
    this.useCalculateMax();
    this.state.active.setValue(1);
    this.useSort();
  }
  useCalculateMax() {
    if (this.state.filterArray.length > this.state.pageCount) {
      this.state.max = Math.floor(this.state.filterArray.length / this.state.pageCount) + (this.state.filterArray.length % this.state.pageCount > 0 ? 1 : 0);
    } else {
      this.state.max = 1;
    }
  }
  usePagination = () => {
    this.state.paginationArray = this.state.filterArray.filter((e, i) => {
      i = i + 1;
      const page = this.state.active.value * this.state.pageCount;
      return i >= page - (this.state.pageCount - 1) && i <= page;
    });
    this.state = { ...this.state };
  }
  useSearch = (search: ITicketSearch) => {
    this.search = search;
    this.useFilter();
  }
  useSort = () => {
    if (this.sort.key) {
      this.state.filterArray.sort((a, b) => a[this.sort.key] < b[this.sort.key] ? (this.sort.stage === 'down' ? -1 : 1) : (this.sort.stage === 'down' ? 1 : -1));
    }
    this.usePagination();

  }
  useShowSpinner = () => {
    this.spinner.show('ticket-main');
  }
  useCheck(checkList: {formControl: FormControl, ticket: TicketVM}[]) {
    this.checkList = checkList;
    console.log(this.checkList);
  }
  useHideSpinner = () => {
    this.spinner.hide('ticket-main');
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
