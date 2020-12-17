import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-deal-search',
  templateUrl: './deal-search.component.html',
  styleUrls: ['./deal-search.component.scss']
})
export class DealSearchComponent {
  @Output() useSearch: EventEmitter<any> = new EventEmitter<any>();
  @Input() search = {
    status: '',
    range: undefined,
    name: '',
    customer: undefined,
  };
}
