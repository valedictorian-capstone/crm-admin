import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IActivitySearch } from '@extras/features/activity';

@Component({
  selector: 'app-activity-query',
  templateUrl: './activity-query.component.html',
  styleUrls: ['./activity-query.component.scss']
})
export class ActivityQueryComponent {
  @Input() search: IActivitySearch;
  @Input() isMain: boolean;
  @Output() useSearch: EventEmitter<IActivitySearch> = new EventEmitter<IActivitySearch>();
  useClear = () => {
    this.search = {
      name: undefined,
      types: [],
      range: undefined,
      assignee: undefined,
      campaign: undefined,
      deal: undefined,
    };
    this.useSearch.emit(this.search);
  }
}
