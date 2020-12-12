import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CalendarView } from 'angular-calendar';

@Component({
  selector: 'app-event-search',
  templateUrl: './event-search.component.html',
  styleUrls: ['./event-search.component.scss']
})
export class EventSearchComponent {
  @Output() useSearch: EventEmitter<any> = new EventEmitter<any>();
  @Input() stage = 'calendar';
  @Input() search = {
    states: [],
    range: undefined,
    name: '',
    type: 'day',
    view: CalendarView.Day,
    viewDate: new Date()
  };

}
