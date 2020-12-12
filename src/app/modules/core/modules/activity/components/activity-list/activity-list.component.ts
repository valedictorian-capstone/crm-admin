import { Component, Input } from '@angular/core';
import { ActivityVM } from '@view-models';
import { CalendarEvent } from 'angular-calendar';

@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.scss']
})
export class ActivityListComponent {
  @Input() canAssign = false;
  @Input() canUpdate = false;
  @Input() events: (CalendarEvent & ActivityVM & { state: string })[] = [];
}
