import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IPipelineSearch } from '@extras/features/pipeline';
@Component({
  selector: 'app-pipeline-query',
  templateUrl: './pipeline-query.component.html',
  styleUrls: ['./pipeline-query.component.scss']
})
export class PipelineQueryComponent {
  @Input() search: IPipelineSearch;
  @Output() useSearch: EventEmitter<IPipelineSearch> = new EventEmitter<IPipelineSearch>();
  useClear = () => {
    this.search = {
      name: undefined,
    };
    this.useSearch.emit(this.search);
  }
}
