import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService, GlobalService } from '@services';
import { AccountVM, EventVM } from '@view-models';
import { CalendarView, CalendarEvent, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { State } from '@store/states';
import { authSelector, eventSelector } from '@store/selectors';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { EventAction } from '@store/actions';
import { NgxSpinnerService } from 'ngx-spinner';
interface IEventMainPageState {
  events: (CalendarEvent & EventVM & { state: string })[],
  array: EventVM[],
  viewStage: boolean,
  you: AccountVM,
  stage: 'calendar' | 'list',
  search: {
    view: CalendarView,
    viewDate: Date,
    type: 'day' | 'month' | 'week',
    states: string[],
    range: { start: Date, end: Date },
    name: string,
  },
  showDateStartPicker: boolean;
  showDateEndPicker: boolean;
  canAdd: boolean;
  canUpdate: boolean;
  canRemove: boolean;
}
@Component({
  selector: 'app-event-main',
  templateUrl: './event-main.page.html',
  styleUrls: ['./event-main.page.scss']
})
export class EventMainPage implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  state: IEventMainPageState = {
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
      range: undefined,
      name: '',
    },
    showDateStartPicker: false,
    showDateEndPicker: false,
    canAdd: false,
    canUpdate: false,
    canRemove: false,
  };
  constructor(
    protected readonly eventService: EventService,
    protected readonly globalService: GlobalService,
    protected readonly activatedRoute: ActivatedRoute,
    protected readonly spinner: NgxSpinnerService,
    protected readonly store: Store<State>
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
          this.state.canAdd = this.state.you.roles.filter((role) => role.canCreateEvent).length > 0;
          this.state.canUpdate = this.state.you.roles.filter((role) => role.canUpdateEvent).length > 0;
          this.state.canRemove = this.state.you.roles.filter((role) => role.canRemoveEvent).length > 0;
        })
      )
      .subscribe();
    this.subscriptions.push(subscription);
  }
  useSocket = () => {
    this.eventService.triggerSocket().subscribe((trigger) => {
      if (trigger.type === 'create') {
        this.state.array.push((trigger.data as EventVM));
      } else if (trigger.type === 'update') {
        this.state.array[this.state.array.findIndex((e) => e.id === (trigger.data as EventVM).id)] = (trigger.data as EventVM);
      } else if (trigger.type === 'remove') {
        this.state.array.splice(this.state.array.findIndex((e) => e.id === (trigger.data as EventVM).id), 1);
      }
      this.useFilter();
    });
  }
  useDispatch = () => {
    const subscription = this.store.select((state) => state.event)
      .pipe(
        tap((event) => {
          const firstLoad = event.firstLoad;
          const data = (event.ids as string[]).map((id) => event.entities[id]);
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
    this.store.dispatch(EventAction.FindAllAction({
      finalize: () => {
        this.useHideSpinner();
      }
    }));
  }
  useFilter = () => {
    console.log(this.state.array);
    if (this.state.stage === 'calendar') {
      this.state.events = this.state.array.map((e) => ({
        id: e.id,
        title: e.name,
        start: new Date(e.dateStart),
        state: new Date() < new Date(e.dateStart) ? 'notStart' : (new Date() >= new Date(e.dateStart) && new Date() < new Date(e.dateEnd) ? 'processing' : 'expired'),
        ...e,
      }));
    } else {
      this.state.events = this.state.array.map((event) => ({
        id: event.id,
        title: event.name,
        start: new Date(event.dateStart),
        state: new Date() < new Date(event.dateStart)
          ? 'notStart' : (new Date() >= new Date(event.dateStart) && new Date() < new Date(event.dateEnd) ? 'processing' : 'expired'),
        ...event,
      })).filter((event) =>
        (this.state.search.states.length === 0 ? true : this.state.search.states.includes(event.state)) &&
        (this.state.search.range?.start ? new Date(event.dateStart).getTime() >= new Date(this.state.search.range.start).getTime() : true) &&
        (this.state.search.range?.end ? new Date(event.dateEnd).getTime() <= new Date(this.state.search.range.end).getTime() : true) &&
        event.name.toLowerCase().includes(this.state.search.name.toLowerCase())
      );
    }
  }
  useSearch = (search: {
    view: CalendarView,
    viewDate: Date,
    type: 'day' | 'month' | 'week',
    states: string[],
    range: { start: Date, end: Date },
    name: string,
  }) => {
    console.log(search);
    this.state.search = { ...this.state.search, ...search };
    this.useFilter();
  }
  usePlus = () => {
    this.globalService.triggerView$.next({ type: 'event', payload: {} });
  }
  useShowSpinner = () => {
    this.spinner.show('event-main');
  }
  useHideSpinner = () => {
    setTimeout(() => {
      this.spinner.hide('event-main');
    }, 1000);
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
