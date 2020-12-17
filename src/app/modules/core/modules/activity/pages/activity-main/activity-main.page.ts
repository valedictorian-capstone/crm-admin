import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { ActivityService, GlobalService } from '@services';
import { ActivityAction } from '@store/actions';
import { activitySelector, authSelector } from '@store/selectors';
import { State } from '@store/states';
import { AccountVM, ActivityVM, DealVM } from '@view-models';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
interface IActivityMainPageState {
  events: (CalendarEvent & ActivityVM & { state: string })[],
  array: ActivityVM[],
  viewStage: boolean,
  you: AccountVM,
  stage: 'calendar' | 'list',
  search: {
    view: CalendarView,
    viewDate: Date,
    type: 'day' | 'month' | 'week',
    states: string[],
    deal: DealVM,
    range: { start: Date, end: Date },
    name: string,
    assignees: AccountVM[]
  },
  showDateStartPicker: boolean;
  showDateEndPicker: boolean;
  canUpdateDeal: boolean;
  canGetAll: boolean;
  canAssign: boolean;
}
@Component({
  selector: 'app-activity-main',
  templateUrl: './activity-main.page.html',
  styleUrls: ['./activity-main.page.scss'],
})
export class ActivityMainPage implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  state: IActivityMainPageState = {
    events: [],
    array: [],
    viewStage: false,
    you: undefined,
    stage: 'calendar',
    search: {
      view: CalendarView.Day,
      viewDate: new Date(),
      type: 'month',
      states: [],
      deal: undefined,
      range: undefined,
      name: '',
      assignees: [],
    },
    showDateStartPicker: false,
    showDateEndPicker: false,
    canUpdateDeal: false,
    canGetAll: false,
    canAssign: false,
  };
  constructor(
    protected readonly activityService: ActivityService,
    protected readonly activatedRoute: ActivatedRoute,
    protected readonly spinner: NgxSpinnerService,
    protected readonly globalService: GlobalService,
    protected readonly store: Store<State>,
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
          this.state.you = profile;
          this.state.canUpdateDeal = this.state.you.roles.filter((role) => role.canUpdateDeal).length > 0;
          this.state.canGetAll = this.state.you.roles.filter((role) => role.canGetAllActivity).length > 0;
          this.state.canAssign = this.state.you.roles.filter((role) => role.canAssignActivity).length > 0;
        })
      )
      .subscribe();
    this.subscriptions.push(subscription);
  }
  useDispatch = () => {
    const subscription = this.store.select((state) => state.activity)
      .pipe(
        tap((activity) => {
          const firstLoad = activity.firstLoad;
          const data = (activity.ids as string[]).map((id) => activity.entities[id]);
          if (!firstLoad) {
            this.useReload();
          } else {
            this.state.array = data;
            this.useFilter();
          }
        })
    ).subscribe()
    this.subscriptions.push(subscription);
  }
  useReload = () => {
    this.useShowSpinner();
    this.store.dispatch(ActivityAction.FindAllAction({
      finalize: () => {
        this.useHideSpinner();
      }
    }));
  }
  useFilter = () => {
    if (this.state.stage === 'calendar') {
      this.state.events = this.state.array.map((e) => ({
        id: e.id,
        title: e.name,
        start: new Date(e.dateStart),
        state: new Date() < new Date(e.dateStart) ? 'notStart' : (new Date() >= new Date(e.dateStart) && new Date() < new Date(e.dateEnd) ? 'processing' : 'expired'),
        ...e,
        draggable: true,
      }));
    } else {
      this.state.events = this.state.array.map((event) => ({
        id: event.id,
        title: event.name,
        start: new Date(event.dateStart),
        state: new Date() < new Date(event.dateStart)
          ? 'notStart' : (new Date() >= new Date(event.dateStart) && new Date() < new Date(event.dateEnd) ? 'processing' : 'expired'),
        ...event,
        draggable: true,
      })).filter((event) =>
        (this.state.search.states.length === 0 ? true : this.state.search.states.includes(event.state)) &&
        (this.state.search.range?.start ? new Date(event.dateStart).getTime() >= new Date(this.state.search.range.start).getTime() : true) &&
        (this.state.search.range?.end ? new Date(event.dateEnd).getTime() <= new Date(this.state.search.range.end).getTime() : true) &&
        (this.state.search.deal ? event.deal?.id === this.state.search.deal.id : true) &&
        event.name.toLowerCase().includes(this.state.search.name.toLowerCase())
        && (this.state.search.assignees.length > 0
          ? (this.state.search.assignees.findIndex((assingee) => assingee.id === event.assignee?.id) > -1) : true)
      );
    }
  }
  useSearch = (search: {
    view: CalendarView,
    viewDate: Date,
    type: 'day' | 'month' | 'week',
    states: string[],
    deal: DealVM,
    range: { start: Date, end: Date },
    name: string,
    assignees: AccountVM[]
  }) => {
    console.log(search);
    this.state.search = { ...this.state.search, ...search };
    this.useFilter();
  }
  useShowSpinner = () => {
    this.spinner.show('activity-main');
  }
  useHideSpinner = () => {
    setTimeout(() => {
      this.spinner.hide('activity-main');
    }, 1000);
  }
  usePlus = () => {
    this.globalService.triggerView$.next({ type: 'activity', payload: {} });
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
