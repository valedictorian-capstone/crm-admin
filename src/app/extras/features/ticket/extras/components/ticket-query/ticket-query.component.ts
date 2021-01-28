import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { ITicketSearch } from '@extras/features/ticket';

@Component({
  selector: 'app-ticket-query',
  templateUrl: './ticket-query.component.html',
  styleUrls: ['./ticket-query.component.scss']
})
export class TicketQueryComponent {
  @Input() search: ITicketSearch;
  @Input() isMain: boolean;
  @Output() useSearch: EventEmitter<ITicketSearch> = new EventEmitter<ITicketSearch>();
}
