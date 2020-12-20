import { TicketAction } from '@actions';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { GlobalService } from '@services';
import { authSelector, ticketSelector } from '@store/selectors';
import { State } from '@store/states';
import { AccountVM, CustomerVM, TicketVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
interface ITicketMainPageState {
  you: AccountVM;
  array: TicketVM[];
  filterArray: TicketVM[];
  search: {
    statuss: string[],
    types: string[],
    range: { start: Date, end: Date },
    name: string,
    assignees: AccountVM[],
    customer: CustomerVM,
  };
  stage: 'done' | 'finding';
  canRemove: boolean;
  canUpdate: boolean;
  canGetFeedback: boolean;
  canAssign: boolean;
}
@Component({
  selector: 'app-ticket-main',
  templateUrl: './ticket-main.page.html',
  styleUrls: ['./ticket-main.page.scss']
})
export class TicketMainPage implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  state: ITicketMainPageState = {
    you: undefined,
    array: [],
    filterArray: [],
    search: {
      statuss: [],
      types: [],
      range: undefined,
      name: '',
      assignees: [],
      customer: undefined,
    },
    stage: 'done',
    canRemove: false,
    canUpdate: false,
    canGetFeedback: false,
    canAssign: false
  };
  constructor(
    protected readonly globalService: GlobalService,
    protected readonly spinner: NgxSpinnerService,
    protected readonly store: Store<State>
  ) {
    this.useLoadMine();
  }
  ngOnInit() {
    this.useDispatch();
  }
  useDispatch = () => {
    const subscription = this.store.select((state) => state.ticket)
      .pipe(
        tap((ticket) => {
          const firstLoad = ticket.firstLoad;
          const data = (ticket.ids as string[]).map((id) => ticket.entities[id]);
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
  useLoadMine = () => {
    const subscription = this.store.select(authSelector.profile)
      .pipe(
        tap((profile) => {
          if (profile) {
            this.state.you = profile;
            this.state.canUpdate = this.state.you.roles.filter((role) => role.canUpdateTicket).length > 0;
            this.state.canRemove = this.state.you.roles.filter((role) => role.canRemoveTicket).length > 0;
            this.state.canAssign = this.state.you.roles.filter((role) => role.canAssignTicket).length > 0;
            this.state.canGetFeedback = this.state.you.roles.filter((role) => role.canGetFeedbackTicket).length > 0;
          }
        })
      )
      .subscribe();
    this.subscriptions.push(subscription);
  }
  useReload = () => {
    this.useShowSpinner();
    this.store.dispatch(TicketAction.FindAllAction({
      finalize: () => {
        this.useHideSpinner();
      }
    }));
  }
  useFilter = () => {
    this.state.filterArray = this.state.array.filter((ticket) =>
      (this.state.search.statuss.length === 0 ? true : ticket.status === 'waiting' ? this.state.search.statuss.includes(ticket.status) : (this.state.canGetFeedback && (ticket.assignee ? ticket.assignee.id !== this.state.you.id : false) ? this.state.search.statuss.includes(ticket.feedbackStatus ? 'resolve' : 'waiting') : this.state.search.statuss.includes(ticket.status))) &&
      (this.state.search.types.length === 0 ? true : this.state.search.types.includes(ticket.type)) &&
      (this.state.search.range?.start ? new Date(ticket.createdAt).getTime() >= new Date(this.state.search.range.start).getTime() : true) &&
      (this.state.search.range?.end ? new Date(ticket.createdAt).getTime() <= new Date(this.state.search.range.end).getTime() : true) &&
      (this.state.search.customer ? ticket.customer.id === this.state.search.customer.id : true) &&
      (this.state.search.assignees.length > 0
        ? (this.state.search.assignees.findIndex((assingee) => assingee.id === ticket.assignee?.id) > -1) : true)
    );
  }
  usePlus = () => {
    this.globalService.triggerView$.next({ type: 'ticket', payload: {} });
  }
  useImport = () => {
    this.globalService.triggerView$.next({ type: 'import', payload: { importType: 'ticket' } });
  }
  useShowSpinner = () => {
    this.spinner.show('ticket-main');
  }
  useHideSpinner = () => {
    setTimeout(() => {
      this.spinner.hide('ticket-main');
    }, 1000);
  }
  useSearch = (search: {
    statuss: [],
    types: [],
    range: undefined,
    name: '',
    assignees: [],
    customer: undefined,
  }) => {
    this.state.search = { ...this.state.search, ...search };
    this.useFilter();
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
