import { Component, Input } from '@angular/core';
import { ActivityService, GlobalService } from '@services';
import { ActivityVM } from '@view-models';
import { CalendarEvent, CalendarView } from 'angular-calendar';

@Component({
  selector: 'app-activity-calendar',
  templateUrl: './activity-calendar.component.html',
  styleUrls: ['./activity-calendar.component.scss']
})
export class ActivityCalendarComponent {
  @Input() events: (CalendarEvent & ActivityVM & { state: string })[] = [];
  @Input() viewDate: Date = new Date();
  @Input() view: CalendarView = CalendarView.Day;
  @Input() type = 'day';
  @Input() canAdd = false;
  @Input() canUpdate = false;
  constructor(
    protected readonly activityService: ActivityService,
    protected readonly globalService: GlobalService,
  ) { }
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
    if (this.canAdd) {
      this.globalService.triggerView$.next({ type: 'activity', payload: { time: event.date } });
    }
  }
  usePlusWithDay = (event) => {
    if (this.canAdd) {
      this.globalService.triggerView$.next({ type: 'activity', payload: { time: event.day.date } });
    }
  }
  useEventClicked({ event }: { event: CalendarEvent & ActivityVM & { state: string } }): void {
    if (this.canUpdate) {
      this.globalService.triggerView$.next({ type: 'activity', payload: { activity: event } });
    }
  }
}
