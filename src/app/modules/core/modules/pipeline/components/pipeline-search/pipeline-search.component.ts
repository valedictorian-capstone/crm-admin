import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-pipeline-search',
  templateUrl: './pipeline-search.component.html',
  styleUrls: ['./pipeline-search.component.scss']
})
export class PipelineSearchComponent {
  @Output() useSearch: EventEmitter<any> = new EventEmitter<any>();
  @Input() search = {
    status: '',
    range: undefined,
    name: '',
    customer: undefined,
  };
}
