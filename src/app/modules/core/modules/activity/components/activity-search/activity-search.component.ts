import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CalendarView } from 'angular-calendar';

@Component({
  selector: 'app-activity-search',
  templateUrl: './activity-search.component.html',
  styleUrls: ['./activity-search.component.scss']
})
export class ActivitySearchComponent {
  @Output() useSearch: EventEmitter<any> = new EventEmitter<any>();
  @Input() stage = 'calendar' ;
  @Input() search = {
    states: [],
    deal: undefined,
    range: undefined,
    name: '',
    type: 'day',
    view: CalendarView.Day,
    viewDate: new Date()
  };
}
