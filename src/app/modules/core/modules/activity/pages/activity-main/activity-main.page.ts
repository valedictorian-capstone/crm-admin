import { Component, OnInit } from '@angular/core';
import { ActivityService, GlobalService } from '@services';
import { ActivityVM } from '@view-models';
import { CalendarEvent, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import { DatePipe } from '@angular/common';
import { Socket } from 'ngx-socket-io';
@Component({
  selector: 'app-activity-main',
  templateUrl: './activity-main.page.html',
  styleUrls: ['./activity-main.page.scss'],
  providers: [DatePipe]
})
export class ActivityMainPage implements OnInit {
  view: CalendarView = CalendarView.Day;
  viewDate: Date = new Date();
  events: (CalendarEvent & ActivityVM & { state: string })[] = [];
  activitys: ActivityVM[] = [];
  type = 'day';
  viewStage = false;
  stage = 'calendar';
  search = {
    states: [],
    deal: undefined,
    range: undefined,
    name: '',
  };
  showDateStartPicker = false;
  showDateEndPicker = false;
  constructor(
    protected readonly activityService: ActivityService,
    protected readonly globalService: GlobalService,
    protected readonly datePipe: DatePipe,
  ) { }

  ngOnInit() {
    this.activityService.findAll().subscribe((data) => {
      this.activitys = data;
      this.useFilter();
    });
    this.useSocket();
  }
  useFilter = () => {
    this.events = this.activitys.map((e) => ({
      id: e.id,
      title: e.name,
      start: new Date(e.dateStart),
      state: new Date() < new Date(e.dateStart) ? 'notStart' : (new Date() >= new Date(e.dateStart) && new Date() < new Date(e.dateEnd) ? 'processing' : 'expired'),
      ...e,
      draggable: true,
    }));
  }
  useSocket = () => {
    this.activityService.triggerSocket().subscribe((trigger) => {
      if (trigger.type === 'create') {
        this.activitys.push(trigger.data as ActivityVM);
      } else if (trigger.type === 'update') {
        this.activitys[this.activitys.findIndex((e) => e.id === (trigger.data as ActivityVM).id)] = (trigger.data as ActivityVM);
      } else if (trigger.type === 'remove') {
        this.activitys.splice(this.activitys.findIndex((e) => e.id === (trigger.data as ActivityVM).id), 1);
      }
      if (this.stage === 'calendar') {
        this.useFilter();
      } else {
        this.useFilterList();
      }
    });
  }
  useFilterList = () => {
    this.events = this.activitys.map((event) => ({
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
      (this.search.deal ? event.deal?.id === this.search.deal.id : true) &&
      event.name.toLowerCase().includes(this.search.name.toLowerCase())
    );
  }
  eventTimesChanged(e: CalendarEventTimesChangedEvent): void {
    e.event.start = e.newStart;
    e.event.end = e.newEnd;
    this.activityService.update({
      id: e.event.id,
      dateStart: e.newStart,
      // dateEnd: e.newEnd
    } as any).subscribe();
  }
  eventClicked({ event }: { event: CalendarEvent }): void {
    this.globalService.triggerView$.next({ type: 'activity', payload: { activity: event } });
  }
  usePlus = () => {
    this.globalService.triggerView$.next({ type: 'activity', payload: {} });
  }
  useIcon = (type: string) => {
    switch (type) {
      case 'email':
        return {
          icon: 'email-outline',
          pack: 'eva'
        };
      case 'call':
        return {
          icon: 'phone-outline',
          pack: 'eva'
        };
      case 'task':
        return {
          icon: 'clock-outline',
          pack: 'eva'
        };
      case 'deadline':
        return {
          icon: 'flag-outline',
          pack: 'eva'
        };
      case 'meetting':
        return {
          icon: 'people-outline',
          pack: 'eva'
        };
      case 'lunch':
        return {
          icon: 'utensils',
          pack: 'font-awesome'
        };
    }
  }
  usePlusWithHour = (event) => {
    this.globalService.triggerView$.next({ type: 'activity', payload: { time: event.date } });
  }
  usePlusWithDay = (event) => {
    this.globalService.triggerView$.next({ type: 'activity', payload: { time: event.day.date } });
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
  toDateFormat = (date: Date | string) => {
    return date && !isNaN(Date.parse(date as string)) ? this.datePipe.transform(new Date(date), 'HH:mm dd/MM/yyyy') : '';
  }
}
