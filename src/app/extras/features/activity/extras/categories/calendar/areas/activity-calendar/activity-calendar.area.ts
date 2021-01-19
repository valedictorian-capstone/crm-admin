import { Component, Input } from '@angular/core';
import { IActivityMainState, IActivitySearch } from '@extras/features/activity';
import { ISort } from '@extras/interfaces';
import { ActivityService, GlobalService } from '@services';
import { ActivityVM, CampaignVM, DealVM } from '@view-models';
import { CalendarEvent } from 'angular-calendar';

@Component({
  selector: 'app-activity-calendar',
  templateUrl: './activity-calendar.area.html',
  styleUrls: ['./activity-calendar.area.scss']
})
export class ActivityCalendarArea {
  @Input() state: IActivityMainState;
  @Input() sort: ISort;
  @Input() isMain: boolean;
  @Input() viewDate: Date = new Date();
  @Input() subType = 'month';
  @Input() for: string;
  @Input() campaign: CampaignVM;
  @Input() deal: DealVM;
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
    if (this.state.canAdd) {
      this.globalService.triggerView$.next({ type: 'activity', payload: { time: event.date, for: this.campaign ? 'campaign' : (this.deal ? 'deal' : this.for), campaign: this.campaign, deal: this.deal, fix: !this.isMain } });
    }
  }
  usePlusWithDay = (event) => {
    if (this.state.canAdd) {
      this.globalService.triggerView$.next({ type: 'activity', payload: { time: event.day.date, for: this.campaign ? 'campaign' : (this.deal ? 'deal' : this.for), campaign: this.campaign, deal: this.deal, fix: !this.isMain } });
    }
  }
  useEventClicked({ event }: { event: CalendarEvent & ActivityVM & { state: string } }): void {
    if (this.state.canUpdate) {
      this.globalService.triggerView$.next({ type: 'activity', payload: { activity: event, for: event.campaign ? 'campaign' : (event.deal ? 'deal' : this.for), campaign: this.campaign, deal: this.deal, fix: !this.isMain } });
    }
  }
}
