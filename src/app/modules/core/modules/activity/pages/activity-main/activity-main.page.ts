import { Component, OnInit } from '@angular/core';
import { ActivityService, GlobalService } from '@services';
import { ActivityVM } from '@view-models';
import { CalendarEvent, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
@Component({
  selector: 'app-activity-main',
  templateUrl: './activity-main.page.html',
  styleUrls: ['./activity-main.page.scss']
})
export class ActivityMainPage implements OnInit {
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  activitys: ActivityVM[] = [];
  type = 'month';
  viewStage = false;
  constructor(
    protected readonly activityService: ActivityService,
    protected readonly globalService: GlobalService,
  ) { }

  ngOnInit() {
    this.activityService.triggerValue$.subscribe((trigger) => {
      if (trigger.type === 'create') {
        this.activitys.push(trigger.data);
      } else if (trigger.type === 'update') {
        this.activitys[this.activitys.findIndex((e) => e.id === trigger.data.id)] = trigger.data;
      } else {
        this.activitys.splice(this.activitys.findIndex((e) => e.id === trigger.data.id), 1);
      }
      this.useFilter();
    });
    this.activityService.findAll().subscribe((data) => {
      this.activitys = data;
      this.useFilter();
    });
  }
  useFilter = () => {
    this.events = this.activitys.map((e) => ({
      id: e.id,
      title: e.name,
      start: new Date(e.dateStart),
      expried: new Date(e.dateStart) > new Date(e.dateEnd),
      ...e,
      draggable: true,
    }));
  }

  eventTimesChanged(e: CalendarEventTimesChangedEvent): void {
    e.event.start = e.newStart;
    e.event.end = e.newEnd;
    this.activityService.update({
      id: e.event.id,
      dateStart: e.newStart,
      // dateEnd: e.newEnd
    } as any).subscribe((data) => {
      this.activityService.triggerValue$.next({ type: 'update', data });
    });
  }
  eventClicked({ event }: { event: CalendarEvent }): void {
    console.log(event);
    this.globalService.triggerView$.next({ type: 'activity', payload: {activity: event} });
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
      case 'luch':
        return {
          icon: 'utensils',
          pack: 'font-awesome'
        };
    }
  }
  usePlusWithHour = (event) => {
    console.log(event);
    this.globalService.triggerView$.next({ type: 'activity', payload: {time: event.date} });
  }
  usePlusWithDay = (event) => {
    console.log(event);
    this.globalService.triggerView$.next({ type: 'activity', payload: {time: event.day.date} });
  }
}
