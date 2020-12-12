import { Component, Input, OnInit } from '@angular/core';
import { EventService, GlobalService } from '@services';
import { EventVM } from '@view-models';
import { CalendarEvent, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';

@Component({
  selector: 'app-event-calendar',
  templateUrl: './event-calendar.component.html',
  styleUrls: ['./event-calendar.component.scss']
})
export class EventCalendarComponent {
  @Input() events: (CalendarEvent & EventVM & { state: string })[] = [];
  @Input() viewDate: Date = new Date();
  @Input() view: CalendarView = CalendarView.Day;
  @Input() type = 'day';
  @Input() canAdd = false;
  @Input() canUpdate = false;
  constructor(
    protected readonly eventService: EventService,
    protected readonly globalService: GlobalService,
  ) { }
  usePlusWithHour = (event) => {
    if (this.canAdd) {
      this.globalService.triggerView$.next({ type: 'event', payload: { time: event.date } });
    }
  }
  usePlusWithDay = (event) => {
    if (this.canAdd) {
      this.globalService.triggerView$.next({ type: 'event', payload: { time: event.day.date } });
    }
  }
  useEventClicked({ event }: { event: CalendarEvent & EventVM & { state: string } }): void {
    if (this.canUpdate) {
      this.globalService.triggerView$.next({ type: 'event', payload: { event } });
    }
  }
}
