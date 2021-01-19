import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IPipelineMainState } from '@extras/features/pipeline';

@Component({
  selector: 'app-pipeline-page-count',
  templateUrl: './pipeline-page-count.component.html',
  styleUrls: ['./pipeline-page-count.component.scss']
})
export class PipelinePageCountComponent {
  @Output() useSelectPageCount: EventEmitter<any> = new EventEmitter<any>();
  @Input() state: IPipelineMainState;
}
