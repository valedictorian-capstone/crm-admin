import { Component, Input } from '@angular/core';
import { EventVM } from '@view-models';
import { CalendarEvent } from 'angular-calendar';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent {
  @Input() canUpdate = false;
  @Input() canRemove = false;
  @Input() events: (CalendarEvent & EventVM & { state: string })[] = [];

}
