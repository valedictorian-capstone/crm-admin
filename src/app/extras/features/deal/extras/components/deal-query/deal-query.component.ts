import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IDealSearch } from '@extras/features/deal';

@Component({
  selector: 'app-deal-query',
  templateUrl: './deal-query.component.html',
  styleUrls: ['./deal-query.component.scss']
})
export class DealQueryComponent {
  @Input() search: IDealSearch;
  @Input() isMain: boolean;
  @Output() useSearch: EventEmitter<IDealSearch> = new EventEmitter<IDealSearch>();
  useClear = () => {
    this.search = {
      title: undefined,
      statuss: [],
      customer: undefined,
      assignee: undefined,
      campaign: undefined,
    };
    this.useSearch.emit(this.search);
  }
}
