import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-lead-search',
  templateUrl: './lead-search.component.html',
  styleUrls: ['./lead-search.component.scss']
})
export class LeadSearchComponent {
  @Output() useSearch: EventEmitter<any> = new EventEmitter<any>();
  @Input() search = {
    value: '',
  };
}
