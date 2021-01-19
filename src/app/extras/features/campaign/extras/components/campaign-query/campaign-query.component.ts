import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ICampaignSearch } from '@extras/features/campaign';
@Component({
  selector: 'app-campaign-query',
  templateUrl: './campaign-query.component.html',
  styleUrls: ['./campaign-query.component.scss']
})
export class CampaignQueryComponent {
  @Input() search: ICampaignSearch;
  @Input() isMain: boolean;
  @Output() useSearch: EventEmitter<ICampaignSearch> = new EventEmitter<ICampaignSearch>();
  useClear = () => {
    this.search = {
      name: undefined,
      types: [],
      range: undefined,
    };
    this.useSearch.emit(this.search);
  }
}
