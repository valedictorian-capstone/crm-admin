import { Component, OnInit } from '@angular/core';
import { EventService, GlobalService } from '@services';
import { EventVM } from '@view-models';
import { CalendarView, CalendarEvent, CalendarEventTimesChangedEvent } from 'angular-calendar';

@Component({
  selector: 'app-event-main',
  templateUrl: './event-main.page.html',
  styleUrls: ['./event-main.page.scss']
})
export class EventMainPage implements OnInit {
  view: CalendarView = CalendarView.Day;
  viewDate: Date = new Date();
  calendarEvents: (CalendarEvent & EventVM & { state: string })[] = [];
  events: EventVM[] = [];
  type = 'month';
  viewStage = false;
  stage = 'calendar';
  search = {
    states: [],
    range: undefined,
    name: '',
  };
  constructor(
    protected readonly eventService: EventService,
    protected readonly globalService: GlobalService,
  ) { }

  ngOnInit() {
    this.eventService.triggerSocket().subscribe((trigger) => {
      if (trigger.type === 'create') {
        this.events.push((trigger.data as EventVM));
      } else if (trigger.type === 'update') {
        this.events[this.events.findIndex((e) => e.id === (trigger.data as EventVM).id)] = (trigger.data as EventVM);
      } else if (trigger.type === 'remove') {
        this.events.splice(this.events.findIndex((e) => e.id === (trigger.data as EventVM).id), 1);
      }
      if (this.stage === 'calendar') {
        this.useFilter();
      } else {
        this.useFilterList();
      }
    });
    this.eventService.findAll().subscribe((data) => {
      this.events = data;
      this.useFilter();
    });
  }
  useFilter = () => {
    this.calendarEvents = this.events.map((e) => ({
      id: e.id,
      title: e.name,
      start: new Date(e.dateStart),
      end: new Date(e.dateEnd),
      state: new Date() < new Date(e.dateStart) ? 'notStart' : (new Date() >= new Date(e.dateStart) && new Date() < new Date(e.dateEnd) ? 'processing' : 'expired'),
      ...e,
    }));
  }
  useFilterList = () => {
    this.calendarEvents = this.events.map((event) => ({
      id: event.id,
      title: event.name,
      start: new Date(event.dateStart),
      state: new Date() < new Date(event.dateStart)
        ? 'notStart' : (new Date() >= new Date(event.dateStart) && new Date() < new Date(event.dateEnd) ? 'processing' : 'expired'),
      ...event,
      draggable: true,
    })).filter((event) =>
      (this.search.states.length === 0 ? true : this.search.states.includes(event.state)) &&
      (this.search.range?.start ? new Date(event.dateStart).getTime() >= new Date(this.search.range.start).getTime() : true) &&
      (this.search.range?.end ? new Date(event.dateEnd).getTime() <= new Date(this.search.range.end).getTime() : true) &&
      event.name.toLowerCase().includes(this.search.name.toLowerCase())
    );
  }
  useCalendarEventTimesChanged(e: CalendarEventTimesChangedEvent): void {
    e.event.start = e.newStart;
    e.event.end = e.newEnd;
    this.eventService.save({
      id: e.event.id,
      dateStart: e.newStart,
      // dateEnd: e.newEnd
    } as any).subscribe();
  }
  useCalendarEventClicked({ event }: { event: CalendarEvent }): void {
    this.globalService.triggerView$.next({ type: 'event', payload: { event } });
  }
  usePlus = () => {
    this.globalService.triggerView$.next({ type: 'event', payload: {} });
  }
  usePlusWithHour = (event) => {
    this.globalService.triggerView$.next({ type: 'event', payload: { time: event.date } });
  }
  usePlusWithDay = (event) => {
    this.globalService.triggerView$.next({ type: 'event', payload: { time: event.day.date } });
  }
  useToggleFilterList = (state: string) => {
    const pos = this.search.states.findIndex((s) => s === state);
    if (pos > -1) {
      this.search.states.splice(pos, 1);
    } else {
      this.search.states.push(state);
    }
    this.useFilterList();
  }
}
