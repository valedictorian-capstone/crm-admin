import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-ticket-search',
  templateUrl: './ticket-search.component.html',
  styleUrls: ['./ticket-search.component.scss']
})
export class TicketSearchComponent implements OnInit {
  @Output() useSearch: EventEmitter<any> = new EventEmitter<any>();
  @Input() search = {
    range: undefined,
    statuss: [],
    customer: undefined,
  };
  constructor() { }

  ngOnInit() {
  }

}
